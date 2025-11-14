import { PinataSDK } from "pinata-web3";
import { processDocumentWithOvis } from "../utils/ovisUtils.js";
import { createWatermarkedFile } from "../utils/watermark.js";
import Document from "../models/Document.js";
import { verifyWatermark } from "../utils/verificationWatermark.js";
import verifierDB from "../models/verifierDB.js";
import { ethers } from "ethers";
import "dotenv/config";
import fetch from "node-fetch";
import Request from "../models/Request.js";
import { convertPdfToImage } from "../utils/PDFtoImage.js";
import path from "path";
import fs from "fs/promises";
import { uploadToIPFS } from "../utils/ipfsUtils.js";

// Initialize Pinata SDK
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.PINATA_GATEWAY,
});

export const verifyDocument = async (req, res) => {
  const { requestId } = req.body;

  // Validate environment variables
  if (
    !process.env.PINATA_JWT ||
    !process.env.PINATA_GATEWAY ||
    !process.env.ETHEREUM_RPC_URL ||
    !process.env.REGISTRY_CONTRACT_ADDRESS
  ) {
    throw new Error("Missing required environment variables");
  }

  const request = await Request.findById(requestId).lean();
  console.log(request);
  console.log(request.aadhaar);
  const { name: username, phone, aadhaar, ipfsHash, documentType } = request;
  console.log(username, phone, aadhaar, ipfsHash, documentType);

  if (!username || !phone || !aadhaar || !ipfsHash) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let prompt = "";

  // Set the prompt based on document type
  switch (documentType) {
    case "ID Card":
      prompt =
        "Extract name, phone number, date of birth in JSON format, nothing else {name, phone, dob}";
      break;
    case "Birth Certificate":
      // If it's a Birth Certificate, skip verification and directly watermark
      try {
        // Fetch document from IPFS
        const ipfsUrl = `https://copper-gigantic-kite-657.mypinata.cloud/ipfs/${ipfsHash}`;
        const response = await fetch(ipfsUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch document. Status: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const pdfBuffer = Buffer.from(arrayBuffer);

        // Add verification watermark
        const watermarkedDocument = await verifyWatermark(pdfBuffer);

        // Upload watermarked document to IPFS
        const watermarkedIpfsResponse = await uploadToIPFS(watermarkedDocument);

        // Update Document in MongoDB
        const document = await Request.findOneAndUpdate(
          { ipfsHash },
          {
            status: "Verified",
            ipfsHash: watermarkedIpfsResponse.hash,
          },
          { new: true }
        );

        // Return successful response
        return res.status(200).json({
          message: "Birth Certificate processed successfully",
          document,
          watermarkedDocumentIpfsUrl: `https://copper-gigantic-kite-657.mypinata.cloud/ipfs/${watermarkedIpfsResponse.IpfsHash}`,
        });
      } catch (error) {
        console.error("Error processing Birth Certificate:", error);
        return res.status(500).json({
          error: "Processing failed",
          details: error.message,
        });
      }
    case "Experience Certificate":
      prompt =
        "Extract name, employee ID, workplace name in JSON format, nothing else {name, employeeID, workplace}";
      break;
    default:
      return res.status(400).json({ error: "Unsupported document type" });
  }

  try {
    // Existing verification flow for other document types
    // Step 1: Fetch document from IPFS
    const ipfsUrl = `https://copper-gigantic-kite-657.mypinata.cloud/ipfs/${ipfsHash}`;
    console.log("Fetching document from:", ipfsUrl);

    const response = await fetch(ipfsUrl);

    // Check response status
    if (!response.ok) {
      throw new Error(`Failed to fetch document. Status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    // Debugging: Save PDF for inspection
    const debugPdfPath = path.join(process.cwd(), "debug", `${ipfsHash}.pdf`);
    await fs.mkdir(path.dirname(debugPdfPath), { recursive: true });
    await fs.writeFile(debugPdfPath, pdfBuffer);
    console.log("Saved debug PDF to:", debugPdfPath);

    // Validate PDF buffer
    if (pdfBuffer.length === 0) {
      throw new Error("Received empty PDF buffer");
    }

    // Step 2: Convert PDF to image for processing
    let imageBuffer;
    try {
      imageBuffer = await convertPdfToImage(pdfBuffer);
    } catch (conversionError) {
      console.error("PDF Conversion Error:", conversionError);
      return res.status(400).json({
        error: "PDF to Image conversion failed",
        details: conversionError.message,
        ipfsHash: ipfsHash,
      });
    }

    // Rest of the verification process
    const documentDetails = await processDocumentWithOvis(imageBuffer, prompt);
    console.log(documentDetails);

    // Step 3: Match extracted data with official verifierDB
    const verifierRecord = await verifierDB.findOne({
      $or: [{ name: documentDetails.name }, { phone: documentDetails.phone }],
    });

// if the document details dont match, notification will be sent to the user with the details
    if (!verifierRecord) {
      return res.status(400).json({
        error: "Document details do not match official records",
        extractedDetails: documentDetails,
      });
    }

    // Step 4: Verify document using the blockchain contract
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    const contract = new ethers.Contract(
      process.env.REGISTRY_CONTRACT_ADDRESS,
      ["function verifyDocument(bytes32) public view returns (bool)"],
      provider
    );
    const documentHash = ethers.keccak256(pdfBuffer);
    const isRegistered = await contract.verifyDocument(documentHash);

    if (!isRegistered) {
      return res
        .status(400)
        .json({ error: "Document not registered on the blockchain" });
    }

    // Step 5: Add verification watermark to the document
    const watermarkedDocument = await verifyWatermark(pdfBuffer);

    // Step 6: Upload watermarked document to IPFS
    const watermarkedIpfsResponse = await uploadToIPFS(watermarkedDocument);
    console.log(watermarkedDocument);

    // Step 7: Update Document in MongoDB
    const document = await Request.findOneAndUpdate(
      { ipfsHash },
      {
        status: "Verified",
        verificationDetails: documentDetails,
        ipfsHash: watermarkedIpfsResponse.hash,
      },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ error: "Document not found in database" });
    }

    // Step 8: Return response
    res.status(200).json({
      message: "Document verified successfully",
      document,
      watermarkedDocumentIpfsUrl: `https://copper-gigantic-kite-657.mypinata.cloud/ipfs/${watermarkedIpfsResponse.IpfsHash}`,
      extractedDetails: documentDetails,
    });
  } catch (error) {
    console.error("Error verifying document:", error);
    const status = error.response?.status || 500;
    res.status(status).json({
      error: "Verification failed",
      details: error.message,
      step: error.step,
    });
  }
};

export const getVerificationRequests = async (req, res) => {
  try {
    const requests = await Request.find();
    res
      .status(200)
      .json({ message: "Requests fetched successfully", requests });
  } catch (error) {
    console.log("Can't fetch verification requests", error);
  }
};