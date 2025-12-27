import { Router } from "express";
import {
  getIssuerRequests,
  issueCertificate,
} from "../controllers/issueController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/requests", authMiddleware, getIssuerRequests);
router.post("/issue", authMiddleware, issueCertificate);

export default router;
