import express from "express";
// Import the authentication middleware from the correct path
import { authMiddleware } from "../middleware/authMiddleware.js";
// Import controller functions
import {
  requestDoc,
  getVerificationRequests,
} from "../controllers/requestController.js";

const router = express.Router();

// Route to handle a new document request
router.post("/requestdoc", authMiddleware, requestDoc);

// Route to get the current user's verification requests
router.get("/myrequests", authMiddleware, getVerificationRequests);

// Route to get all document requests (for issuer dashboard)
router.get("/allrequests", authMiddleware, async (req, res) => {
  try {
    // Only allow issuers to see this
    if (req.user.role !== "issuer") {
      return res.status(403).json({ message: "Access denied. Issuers only." });
    }

    const requests = await import("../models/Request.js").then((m) =>
      m.default.find()
    );

    res.json({ requests });
  } catch (err) {
    console.error("Error fetching all requests:", err);
    res.status(500).json({ message: "Failed to fetch requests." });
  }
});

export default router;
