import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path"; // 👈 Required to handle file paths

import requestRoute from "./routes/request.js";
import verifyRoute from "./routes/verify.js";
import issueRoute from "./routes/issue.js";
import authRoute from "./routes/auth.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL;
const MONGO_URI = process.env.MONGO_URI;

// 1. CORS Setup
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// 2. Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. ✅ STATIC FILE SERVING (Crucial for View Certificate)
// This exposes the 'temp' folder so browsers can access http://localhost:5000/temp/file.pdf
const __dirname = path.resolve();
app.use("/temp", express.static(path.join(__dirname, "temp")));

// 4. Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// 5. Routes
app.use("/api/request", requestRoute);
app.use("/api/verify", verifyRoute);
app.use("/api/issue", issueRoute);
app.use("/api", authRoute);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("SmartDoc Backend API running");
});

// 6. Database Connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection failed", err);
    process.exit(1);
  });