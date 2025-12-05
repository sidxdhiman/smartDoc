// 1. Environment variables loaded FIRST
import "dotenv/config";

// 2. All other imports
import express from "express";
import cors from "cors";
import mongoose from "mongoose"; // Import Mongoose
import verifyRoute from "./routes/verify.js";
import requestRoute from "./routes/request.js";
import issueRoute from "./routes/issue.js";
import authRoute from "./routes/auth.js"; // Added your auth route

// 3. --- Environment Variable Check ---
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
const MONGO_URI = process.env.MONGO_URI; // Get the URI from .env

// 4. CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (origin === FRONTEND_URL || !origin) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  optionsSuccessStatus: 200,
};

// --- 5. Core Middleware (All grouped together before routes) ---
app.use(cors(corsOptions));

// ESSENTIAL FIX: Body parser for JSON must run BEFORE any routes
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Robustness for form data

// Simple logger middleware (moved to ensure it runs before routes)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  // Log the body received, which should now be populated by express.json()
  // console.log("REQ BODY:", req.body);
  next();
});
// ------------------------------------------------------------------

// 6. Routes
app.use("/api", requestRoute);
app.use("/api", issueRoute);
app.use("/api", verifyRoute);
app.use("/api", authRoute); // Ensure auth routes are used

// 7. Optional: Add a general catch-all for root URL
app.get("/", (req, res) => {
  res.send("SmartDoc Backend API is running.");
});

// 8. --- Connect to DB THEN Start Server ---
const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully.");

    // 2. Start the Express server *only after* the DB connection is successful
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ FATAL ERROR: Could not connect to MongoDB.");
    console.error(error.message);
    process.exit(1); // Exit the process with failure
  }
};

// 9. Run the server
startServer();
