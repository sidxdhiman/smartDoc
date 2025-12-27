import { Router } from "express";
import multer from "multer"; // Import Multer
import { requestDoc, getMyRequests } from "../controllers/requestController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// --- MULTER SETUP (To handle file uploads) ---
// This saves the file to a 'temp' folder temporarily
const upload = multer({ dest: "temp/" }); 

// ✅ Add 'upload.single("file")' to the route
// This tells the backend: "Expect a file named 'file' in this request"
router.post("/requestdoc", authMiddleware, upload.single("file"), requestDoc);

router.get("/myrequests", authMiddleware, getMyRequests);

export default router;