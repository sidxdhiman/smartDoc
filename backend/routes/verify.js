import express from "express";
import { getVerificationRequests, verifyDocument } from "../controllers/verifyController.js";
import { verifyToken } from "../middleware/auth.js"; 

const router = express.Router();

// 1. GET: Fetch all requests (Pending + History)
// Frontend calls: axios.get('/api/verify/requests')
router.get("/requests", verifyToken, getVerificationRequests);

// 2. POST: Verify a specific document
// Frontend calls: axios.post('/api/verify/verify', { requestId })
router.post("/verify", verifyToken, verifyDocument);

export default router;