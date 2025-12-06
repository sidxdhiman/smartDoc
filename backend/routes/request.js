import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  requestDoc,
  getVerificationRequests,
  updateRequestStatus,
} from "../controllers/requestController.js";

const router = express.Router();

// ===============================================
// 🔹 Individual Routes
// ===============================================

// POST /api/requestdoc → individual uploads document request
router.post("/requestdoc", authMiddleware, requestDoc);

// GET /api/myrequests → individual views their own requests
router.get("/myrequests", authMiddleware, getVerificationRequests);

// ===============================================
// 🔹 Issuer & Verifier Routes
// ===============================================

// GET /api/allrequests → issuer/verifier view document requests
router.get("/allrequests", authMiddleware, async (req, res) => {
  try {
    const { default: Request } = await import("../models/Request.js");

    // ✅ Allow both issuers and verifiers
    if (!req.user || !["issuer", "verifier"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied." });
    }

    let filter = {};

    // 🔹 Issuer sees all requests
    // 🔹 Verifier sees only those sent to them for verification
    if (req.user.role === "verifier") {
      filter = { status: "SentToVerifier" };
    }

    const requests = await Request.find(filter).sort({ createdAt: -1 });
    res.json({ requests });
  } catch (err) {
    console.error("Error fetching all requests:", err);
    res.status(500).json({ message: "Failed to fetch requests." });
  }
});

// PATCH /api/updaterequest → issuer updates status (send/deny)
router.patch("/updaterequest", authMiddleware, updateRequestStatus);

export default router;
