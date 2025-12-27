import fs from 'fs';
import Request from "../models/Request.js";
import addWatermark from "../utils/verificationWatermark.js";

// Issuer dashboard
export const getIssuerRequests = async (req, res) => {
  try {
    // ✅ CHANGED: Removed { status: "VERIFIED" }
    // Now it fetches EVERYTHING sent to the issuer (Verified & Issued)
    const requests = await Request.find({
      targetRole: "issuer",
    }).sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests" });
  }
};

// Issue certificate
export const issueCertificate = async (req, res) => {
  const { requestId } = req.body;

  try {
    console.log(`[Issue Cert] Processing Request ID: ${requestId}`);

    // 1. Check Role
    // if (req.user.role !== "issuer") {
    //   return res.status(403).json({ message: "Issuer only" });
    // }
    console.log("Bypassed role check for debugging.");

    // 2. Find Request
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // 3. GET THE FILE PATH FROM DATABASE
    // We stop guessing and use what is saved in the DB
    const pdfPath = request.documentUrl;
    
    console.log(`[Issue Cert] Looking for file at: ${pdfPath}`);

    // 4. Verify file exists on disk
    if (!pdfPath || !fs.existsSync(pdfPath)) {
      console.error(`[Issue Cert] ERROR: File missing at ${pdfPath}`);
      return res.status(404).json({ 
        message: "Original file not found on server. It may have been deleted." 
      });
    }

    // 5. Apply Watermark
    console.log("[Issue Cert] Applying watermark...");
    const watermarkedPdf = await addWatermark(pdfPath, "SMARTDOC");
    console.log("[Issue Cert] Watermark applied successfully.");

    // 6. Update Status
    request.status = "ISSUED";

    request.issuedDocumentUrl = watermarkedPdf;

    await request.save();

    res.json({
      message: "Certificate issued successfully",
      file: watermarkedPdf,
    });

  } catch (error) {
    console.error("[Issue Cert] CRASH:", error);
    res.status(500).json({ 
      message: "Failed to issue certificate. Check server logs.",
      error: error.message 
    });
  }
};







// import Request from "../models/Request.js";
// import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
// import fs from "fs";
// import path from "path";

// // --- Helper: Add Watermark (Centered) ---
// const addWatermark = async (filePath, watermarkText) => {
//   try {
//     const existingPdfBytes = fs.readFileSync(filePath);
//     const pdfDoc = await PDFDocument.load(existingPdfBytes);

//     const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
//     const fontSize = 50;
//     const pages = pdfDoc.getPages();

//     for (const page of pages) {
//       const { width, height } = page.getSize();
//       const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
//       const textHeight = font.heightAtSize(fontSize);

//       // Centering Math
//       const x = (width / 2) - (textWidth / 2) * 0.707 - (textHeight / 2) * 0.707;
//       const y = (height / 2) - (textWidth / 2) * 0.707 + (textHeight / 2) * 0.707;

//       page.drawText(watermarkText, {
//         x: x,
//         y: y,
//         size: fontSize,
//         font: font,
//         color: rgb(0.75, 0.75, 0.75),
//         opacity: 0.4,
//         rotate: degrees(45),
//       });
//     }

//     return await pdfDoc.save();
//   } catch (err) {
//     console.error("Watermark Error:", err);
//     throw new Error("Failed to add watermark");
//   }
// };

// // --- Issuer Dashboard ---
// export const getIssuerRequests = async (req, res) => {
//   try {
//     const requests = await Request.find({
//       targetRole: "issuer",
//     }).sort({ createdAt: -1 });

//     res.json({ requests });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching requests" });
//   }
// };

// // --- Issue Certificate ---
// export const issueCertificate = async (req, res) => {
//   const { requestId } = req.body;

//   try {
//     console.log(`[Issue Cert] Processing Request ID: ${requestId}`);

//     // 1. Find Request
//     const request = await Request.findById(requestId);
//     if (!request) {
//       return res.status(404).json({ message: "Request not found" });
//     }

//     // 2. SAFETY CHECK: Ensure file path exists in DB
//     if (!request.originalDocumentUrl) {
//         console.error(`[Issue Cert] ERROR: No file path found for ID ${requestId}`);
//         // Instead of crashing, we return a clear error
//         return res.status(400).json({ 
//             message: "Error: This request has no file attached. Please reject it and ask user to upload again." 
//         });
//     }

//     // 3. Resolve Path
//     const __dirname = path.resolve();
//     const pdfPath = path.join(__dirname, request.originalDocumentUrl);
    
//     console.log(`[Issue Cert] Looking for file at: ${pdfPath}`);

//     // 4. Verify file exists on disk
//     if (!fs.existsSync(pdfPath)) {
//       console.error(`[Issue Cert] ERROR: File missing at ${pdfPath}`);
//       return res.status(404).json({ 
//         message: "Original file not found on server disk. It may have been deleted." 
//       });
//     }

//     // 5. Apply Watermark
//     console.log("[Issue Cert] Applying watermark...");
//     const watermarkedPdfBytes = await addWatermark(pdfPath, "SMARTDOC VERIFIED");

//     // 6. Save Issued File to Disk
//     const tempDir = path.join(__dirname, "temp");
//     if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

//     const fileName = `issued-${request._id}-${Date.now()}.pdf`;
//     const outputPath = path.join(tempDir, fileName);

//     fs.writeFileSync(outputPath, watermarkedPdfBytes);
//     console.log(`[Issue Cert] Saved to disk at: ${outputPath}`);

//     // 7. Update Status
//     request.status = "ISSUED";
//     request.issuedDocumentUrl = `temp/${fileName}`; 

//     await request.save();

//     res.json({
//       message: "Certificate issued successfully",
//       issuedDocumentUrl: request.issuedDocumentUrl,
//     });

//   } catch (error) {
//     console.error("[Issue Cert] CRASH:", error);
//     res.status(500).json({ 
//       message: "Server Error during issuance",
//       error: error.message 
//     });
//   }
// };