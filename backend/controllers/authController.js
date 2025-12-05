import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// --- Utility function to create JWT token ---
const createToken = (id, role) => {
  // Uses the PRIVATE_KEY from environment variables
  return jwt.sign({ id, role }, process.env.PRIVATE_KEY, {
    expiresIn: "3d", // Token expires in 3 days
  });
};

// ==========================================================
//           1. SIGNUP (REGISTER)
// ==========================================================
export const signup = async (req, res) => {
  try {
    const {
      role,
      name,
      email,
      password,
      phone,
      aadhaar,
      issuerId,
      verifierId,
    } = req.body;

    if (!role || !["individual", "issuer", "verifier"].includes(role)) {
      return res.status(400).json({ message: "Invalid or missing role." });
    }

    // --- Role-specific validation ---
    let requiredFields = ["name", "email", "password"];
    let finalPayload = { name, email, password, role };

    if (role === "individual") {
      requiredFields.push("phone", "aadhaar");
      finalPayload = { ...finalPayload, phone, aadhaar };
    } else if (role === "issuer") {
      requiredFields.push("issuerId");
      finalPayload = { ...finalPayload, issuerId };
    } else if (role === "verifier") {
      requiredFields.push("verifierId");
      finalPayload = { ...finalPayload, verifierId };
    }

    // --- Check missing fields ---
    const missingField = requiredFields.find(
      (field) =>
        !finalPayload[field] || String(finalPayload[field]).trim() === ""
    );

    if (missingField) {
      return res
        .status(400)
        .json({ message: `Missing required field: ${missingField}.` });
    }

    // --- Check if user already exists ---
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists." });
    }

    // --- Hash password ---
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // --- Save user ---
    const newUser = new User({
      ...finalPayload,
      password: hashedPassword,
    });

    await newUser.save();

    // --- Create JWT token with role ---
    const token = createToken(newUser._id, newUser.role);

    // --- Response ---
    res.status(201).json({
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
      message: "Registration successful!",
    });
  } catch (error) {
    console.error("Signup error:", error);
    let errorMessage = "Server error during registration.";
    if (error.name === "ValidationError") {
      console.error("Mongoose Validation Error Details:", error.errors);
      errorMessage = `Validation failed: ${Object.keys(error.errors).join(
        ", "
      )}`;
    }
    res.status(500).json({ message: errorMessage });
  }
};

// ==========================================================
//           2. LOGIN
// ==========================================================
export const login = async (req, res) => {
  try {
    const { email: loginInput, password } = req.body;

    if (!loginInput || !password) {
      return res
        .status(400)
        .json({ message: "Login identifier and password are required." });
    }

    const user = await User.findOne({
      $or: [{ email: loginInput }, { phone: loginInput }],
    }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // ✅ Include role when creating token
    const token = createToken(user._id, user.role);

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
      message: "Login successful!",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};
