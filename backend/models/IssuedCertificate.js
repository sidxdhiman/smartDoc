import mongoose from "mongoose";

const issuedCertificateSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },

    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },

    individualId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    issuerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    verifierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    pdfIndividual: {
      type: String, // path or IPFS URL
      required: true,
    },

    pdfVerifier: {
      type: String, // watermark PDF
      required: true,
    },

    blockchain: {
      network: String,        // polygon / avalanche / solana
      txHash: String,
      gasCost: String,
    },

    status: {
      type: String,
      default: "ISSUED",
    },
  },
  { timestamps: true }
);

export default mongoose.model("IssuedCertificate", issuedCertificateSchema);
