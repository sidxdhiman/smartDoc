import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware to protect routes.
 * Verifies JWT from the Authorization header.
 */
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check for token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Not authorized, no token provided" });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    // 3. Verify token (Using PRIVATE_KEY as per your .env)
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);

    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // 4. Fetch user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 5. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

// ✅ CRITICAL FIX: Export 'authMiddleware' as an alias for 'verifyToken'
// This keeps request.js happy (which asks for authMiddleware)
// And keeps verify.js happy (which asks for verifyToken)
export const authMiddleware = verifyToken;