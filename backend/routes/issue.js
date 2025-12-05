import { Router } from "express";
import {
  issueCertificate,
  getAllRequests,
} from "../controllers/issueController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// ✅ Protect issuer routes with authentication
router.post("/issue", authMiddleware, issueCertificate);

// (Optional) Route for issuers to fetch all pending requests
router.get("/allrequests", authMiddleware, getAllRequests);

export default router;
