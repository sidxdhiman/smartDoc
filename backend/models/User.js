// models/User.js

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // --- Universal Fields ---
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      // Used for PIN (Individual) or Password (Issuer/Verifier)
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["individual", "issuer", "verifier"],
      required: true,
      default: "individual",
    },

    // --- Individual Role Fields (Required only for 'individual') ---
    phone: {
      type: String,
      // The phone is ONLY required if the role is 'individual'
      required: function () {
        return this.role === "individual";
      },
      trim: true,
      validate: {
        validator: function (v) {
          // If it's required (individual role), validate it's 10 digits.
          if (this.role === "individual" && v) {
            return /^\d{10}$/.test(v);
          }
          // If it's not required (issuer/verifier role) or if it's an empty string, it passes.
          return true;
        },
        message: (props) =>
          `${props.value} is not a valid 10-digit phone number!`,
      },
    },
    aadhaar: {
      type: String,
      // The aadhaar is ONLY required if the role is 'individual'
      required: function () {
        return this.role === "individual";
      },
      unique: true,
      sparse: true,
      trim: true,
    },

    // --- Issuer Role Field (Only available for 'issuer') ---
    issuerId: {
      type: String,
      // issuerId is ONLY required if the role is 'issuer'
      required: function () {
        return this.role === "issuer";
      },
      unique: true,
      sparse: true, // Allows null/missing values for non-issuer users
    },

    // --- Verifier Role Field (Only available for 'verifier') ---
    verifierId: {
      type: String,
      // verifierId is ONLY required if the role is 'verifier'
      required: function () {
        return this.role === "verifier";
      },
      unique: true,
      sparse: true, // Allows null/missing values for non-verifier users
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Mongoose options
    timestamps: true,
    strict: true,
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
