import { Router } from "express";
import { verifyDocument, getVerificationRequests } from "../controllers/verifyController.js"; // Create the controller for the logic


const router = Router();

router.post("/verifydoc", verifyDocument);
router.get("/getVerificationReq", getVerificationRequests);

export default router;
