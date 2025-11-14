import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  aadhaar: { type: String, required: true },
  dob: { type: Date },
  UID: { type: String, required: true },
  issuingAuthority: { type: String, required: true },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  ipfsHash: { type: String },
  documentHash: { type: String },
  documentType: {
    type: String,
    enum: ["ID Card", "Experience Certificate", "Birth Certificate"],
    required: true,
  },
  // these fields will only be filled if experience certificate is selected
  companyName: String,
  startDate: Date,
  endDate: Date,
  designation: String,
  // only for birth certificate
  registrationNumber: { type: String },
  parentDetails: {
    fatherName: String,
    motherName: String,
  },
  placeOfBirth: String,
  verificationDetails: Object,
});

export default mongoose.model("Request", requestSchema);
