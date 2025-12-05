// controllers/requestController.js
import Request from "../models/Request.js";

// Handles POST /api/requestdoc
export const requestDoc = async (req, res) => {
  try {
    const {
      name,
      phone,
      aadhaar,
      documentType,
      issuingAuthority,
      role,
      dob,
      UID,
      parentDetails,
      placeOfBirth,
      companyName,
      startDate,
      endDate,
      designation,
      registrationNumber,
    } = req.body;

    if (!name || !phone || !aadhaar || !documentType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newRequest = new Request({
      userId: req.user._id,
      name,
      phone,
      aadhaar,
      documentType,
      issuingAuthority,
      role,
      dob,
      UID,
      parentDetails,
      placeOfBirth,
      companyName,
      startDate,
      endDate,
      designation,
      registrationNumber,
      status: "Pending",
    });

    await newRequest.save();
    res.status(201).json({
      message: "Document request submitted successfully",
      request: newRequest,
    });
  } catch (error) {
    console.error("Error in requestDoc:", error);
    res.status(500).json({ message: "Failed to create document request" });
  }
};

// ✅ Add this function to fix the crash
export const getVerificationRequests = async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching verification requests:", error);
    res.status(500).json({ message: "Failed to fetch verification requests" });
  }
};
