import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  documentType: String,
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: {
    type: String,
    enum: ["PENDING", "ISSUED", "VERIFIED", "REJECTED"],
    default: "PENDING",
  },
  verifierId: { type: mongoose.Schema.Types.ObjectId, required: true },
  issuerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  ipfsHash: String,
  fileSize: Number,
  mimeType: String,
  gatewayUrls: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Document", documentSchema);
