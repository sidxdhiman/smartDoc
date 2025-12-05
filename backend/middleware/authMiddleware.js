import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware to protect routes.
 * Verifies JWT from the Authorization header,
 * finds the user in MongoDB,
 * and attaches the full user document to req.user.
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 🔐 1. Check for token presence
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Not authorized, no token provided" });
    }

    // 🧩 2. Extract token
    const token = authHeader.split(" ")[1];

    // 🧾 3. Verify token using the same key used when signing (PRIVATE_KEY)
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);

    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // 🧍 4. Fetch full user from database (minus password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ 5. Attach user object to the request for downstream controllers
    req.user = user;
    console.log("Authenticated user:", req.user.email, req.user.role);

    // Proceed to next middleware/controller
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};
