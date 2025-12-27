import Request from "../models/Request.js";

// Individual uploads document → VERIFIER
export const requestDoc = async (req, res) => {
  try {
    console.log("Body:", req.body); // Debugging: See text data
    console.log("File:", req.file); // Debugging: See file data

    // 1. Check if file is missing
    if (!req.file) {
      return res.status(400).json({ message: "Document file is required" });
    }

    const { name, phone, aadhaar, documentType } = req.body;

    // 2. Check for missing text fields
    if (!name || !phone || !aadhaar || !documentType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 3. Create Request with the File Path
    const request = await Request.create({
      userId: req.user._id,
      name,
      phone,
      aadhaar,
      documentType: documentType.trim().toLowerCase(),
      
      // ✅ SAVE THE FILE PATH HERE
      // Note: If your schema uses a different name (like 'file' or 'path'), change 'documentUrl' below.
      documentUrl: req.file.path, 
      
      targetRole: "verifier",
      status: "PENDING",
    });

    res.status(201).json({ request });
  } catch (err) {
    console.error("Error creating request:", err);
    res.status(500).json({ message: "Failed to create request" });
  }
};

// Individual sees own requests
export const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching requests" });
  }
};