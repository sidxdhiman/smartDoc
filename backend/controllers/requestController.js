import Request from "../models/Request.js";

export const requestDoc = async (req, res) => {
  try {
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
    } = req.body;

    // Validate input
    if (!name || !phone || !aadhaar || !documentType) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Save request in the database
    const newRequest = new Request({
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
      createdAt: new Date(),
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
