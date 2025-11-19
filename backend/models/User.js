import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Use email as the unique identifier for login
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no two users have the same email
      lowercase: true,
      trim: true,
    },
    // Store the hashed password
    password: {
      type: String,
      required: true,
      select: false, // Important: Don't return password by default on queries
    },
    // Keep other fields
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    aadhaar: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export default mongoose.model("User", userSchema);
