import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: String,
    phone: String,
    aadhaar: String,
    documentType: String,
    
    // ✅ ADD THIS FIELD
    documentUrl: { 
      type: String, 
      required: true 
    },
    
    issuedDocumentUrl: { 
      type: String 
    },

    targetRole: {
      type: String,
      enum: ["verifier", "issuer"],
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED", "ISSUED"],
      default: "PENDING",
    },

    verificationDetails: Object,
    verifiedAt: Date,
    verifiedBy: String,
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);