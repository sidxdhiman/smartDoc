import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

// POST /api/signup - Registration endpoint
router.post("/signup", signup);

// POST /api/login - Login endpoint
router.post("/login", login);

export default router;
