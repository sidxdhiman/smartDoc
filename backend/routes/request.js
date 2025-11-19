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

export default router;
