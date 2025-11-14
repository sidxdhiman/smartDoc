import { Router } from "express";
import { requestDoc } from "../controllers/requestController.js";

const router = Router();

router.post("/requestdoc", requestDoc);

export default router;
