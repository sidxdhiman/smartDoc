import jwt from "jsonwebtoken";

/**
 * This middleware protects routes.
 * It verifies the JWT token from the Authorization header
 * and attaches the user's ID to the request object (req.userId).
 */
export const authMiddleware = async (req, res, next) => {
  let token; // 1. Check for the authorization header

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (e.g., "Bearer eyJhbGci...")
      token = req.headers.authorization.split(" ")[1]; // Verify the token using your private key (from environment variables)

      const decoded = jwt.verify(token, process.env.PRIVATE_KEY); // Attach the user's ID to the request object

      req.userId = decoded.id; // Move to the next function in the chain (the controller)

      next();
    } catch (error) {
      console.error("Token verification failed:", error.message); // Token is invalid (expired, wrong signature, etc.)
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    // If authorization header is missing or not in "Bearer token" format
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }
};
