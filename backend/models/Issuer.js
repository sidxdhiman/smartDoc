import mongoose from "mongoose";

const issuerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logo: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Issuer", issuerSchema);
