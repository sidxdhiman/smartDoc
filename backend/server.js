// 1. Environment variables loaded FIRST
import "dotenv/config";

// 2. All other imports
import express from "express";
import cors from "cors";
import connectDB from "./utils/connectDB.js";
import verifyRoute from "./routes/verify.js";
import requestRoute from "./routes/request.js";
import issueRoute from "./routes/issue.js";

// 3. --- Environment Variable Check ---
// A single place to validate all required .env variables
const requiredEnvVars = ["PORT", "MONGO_URI", "FRONTEND_URL", "PRIVATE_KEY"];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("❌ FATAL ERROR: Missing required environment variables:");
  missingVars.forEach((varName) => console.error(`- ${varName}`));
  console.error("Please add them to your .env file and restart.");
  process.exit(1); // Stop the server if any key is missing
}
// --- All checks passed ---

const app = express();
const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

// 4. CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests from your frontend, and block others
    // The '|| !origin' allows server-to-server requests or tools like Postman
    if (origin === FRONTEND_URL || !origin) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  optionsSuccessStatus: 200,
};

// 5. Middleware
app.use(cors(corsOptions));
app.use(express.json()); // Body parser for JSON

// 6. Connect to the database
connectDB();

// 7. Routes
app.use("/api", requestRoute);
app.use("/api", issueRoute);
app.use("/api", verifyRoute);

// 8. Simple logger middleware (your original logger)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// 9. Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// 10. Optional: Add a general catch-all for root URL
app.get("/", (req, res) => {
  res.send("SmartDoc Backend API is running.");
});
