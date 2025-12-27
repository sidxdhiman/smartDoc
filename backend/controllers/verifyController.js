import Request from "../models/Request.js";

// 1. Get Requests (Pending + History)
export const getVerificationRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      $or: [
        { targetRole: "verifier" }, // Waiting for verification
        { verifiedBy: req.user._id } // Already verified by THIS user (History)
      ]
    }).sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// 2. Verify Document Action
export const verifyDocument = async (req, res) => {
  try {
    const { requestId } = req.body;
    
    // Find the request
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // ✅ CRITICAL UPDATES
    request.status = "VERIFIED";   // Updates the badge color
    request.targetRole = "issuer"; // Sends it to the Issuer's Dashboard
    
    // Record who verified it
    request.verifiedBy = req.user._id;
    request.verifiedAt = new Date();

    await request.save();

    res.status(200).json({ message: "Document verified successfully", request });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ error: "Failed to verify document" });
  }
};