import mongoose from "mongoose";

const verifierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  aadhaar: { type: String, required: true },
  fatherName: { type: String },
  sex: { type: String },
  dateOfBirth: { type: String },
});

export default mongoose.model("verifiedRecord", verifierSchema);
