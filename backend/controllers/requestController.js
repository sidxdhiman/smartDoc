import Request from "../models/Request.js";

// The import below was removed in the previous step and should remain removed.
// import { VerificationRequest } from "../controllers/verifyController.js";

export const requestDoc = async (req, res) => {
  try {
    // 1. Get the logged-in user's ID from the auth middleware
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated." });
    }

    const {
      name,
      phone,
      dob,
      UID,
      role,
      aadhaar,
      documentType,
      issuingAuthority,
      parentDetails,
      placeOfBirth,
      companyName,
      startDate,
      endDate,
      designation,
      registrationNumber,
    } = req.body; // 2. Validate input

    if (!name || !phone || !aadhaar || !documentType) {
      return res.status(400).json({ error: "All fields are required." });
    } // 3. Save request in the database, now LINKED to the user

    const newRequest = new Request({
      userId, // <-- HERE is the link
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
      status: "Pending", // We no longer need 'createdAt: new Date()' // because 'timestamps: true' in the schema handles it.
    });

    await newRequest.save();

    res.status(201).json({
      message: "Document request successfully processed",
      status: "Pending Verification",
      requestId: newRequest._id,
    });
  } catch (error) {
    console.error("Error processing document request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Renamed from getMyVerificationRequests to getVerificationRequests
export const getVerificationRequests = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "User ID not found, authorization denied." });
    } // This will now find all documents created by this user

    const requests = await Request.find({ userId: userId });

    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching user's verification requests:", error);
    res.status(500).json({ message: "Server error fetching requests." });
  }
};
