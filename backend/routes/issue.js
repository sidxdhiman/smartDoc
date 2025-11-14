import { Router } from "express";
import {
  // FIX: Changed 'issueDocument' to 'issueCertificate'
  // to match the function name in your controller file.
  issueCertificate,
} from "../controllers/issueController.js";

const router = Router();

// FIX: Changed the route path from '/issuedoc' to '/issue' to match server.js
// and changed 'issueDocument' to 'issueCertificate'.
router.post("/issue", issueCertificate);

// router.get("/getrequests", getRequestedDocs); // This is correctly commented out

export default router;
