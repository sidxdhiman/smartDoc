// controllers/requestController.js
import Request from "../models/Request.js";

// ==================================================
// 🔹 Handles POST /api/requestdoc  (Individual uploads document)
// ==================================================
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

    // Basic validation
    if (!name || !phone || !aadhaar || !documentType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Normalize documentType (clean lowercase)
    const normalizedType = documentType.trim().toLowerCase();

    // Create new document request
    const newRequest = new Request({
      userId: req.user._id,
      name,
      phone,
      aadhaar,
      documentType: normalizedType, // ✅ normalized version
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

// ==================================================
// 🔹 Handles GET /api/myrequests (Individual’s own requests)
// ==================================================
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

// ==================================================
// 🔹 PATCH /api/updaterequest (Issuer updates request status)
// ==================================================
export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId, newStatus } = req.body;

    // Ensure only issuers can perform this
    if (!req.user || req.user.role !== "issuer") {
      return res.status(403).json({ message: "Access denied. Issuers only." });
    }

    // Validate input
    if (!requestId || !newStatus) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Only allow specific transitions
    const allowedStatuses = ["Rejected", "SentToVerifier"];
    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      { status: newStatus },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found." });
    }

    res.status(200).json({
      message: `Request ${
        newStatus === "Rejected" ? "denied" : "sent for verification"
      } successfully.`,
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ message: "Failed to update request status." });
  }
};
