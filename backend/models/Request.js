import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    // This field links this request to the user who created it.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This must match the name you used in mongoose.model("User", ...)
      required: true,
    }, // --- Essential Fields ---

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
    documentType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"], // Added validation for status
      default: "Pending",
    }, // --- Optional Fields (General/Student/Employment related) ---

    issuingAuthority: String,
    role: String,
    dob: Date,
    UID: String,
    parentDetails: { type: String, required: false }, // Use an object if structure is complex
    placeOfBirth: String, // Employment specific fields
    companyName: String,
    startDate: Date,
    endDate: Date,
    designation: String,
    registrationNumber: String,
  },
  {
    // This automatically adds `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

export default mongoose.model("Request", requestSchema);
