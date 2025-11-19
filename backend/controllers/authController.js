import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// --- Utility function to create JWT token ---
const createToken = (id) => {
  // Uses the PRIVATE_KEY from environment variables
  return jwt.sign({ id }, process.env.PRIVATE_KEY, {
    expiresIn: "3d", // Token expires in 3 days
  });
};

// ==========================================================
//                 1. SIGNUP (REGISTER)
// ==========================================================
// (This function is already correct and requires no changes)
export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, aadhaar } = req.body;

    // 1. Basic validation
    if (!name || !email || !password || !phone || !aadhaar) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists." });
    }
    // (Optional: You could add another check here for existing phone number)
    // const existingPhone = await User.findOne({ phone });
    // if (existingPhone) {
    //   return res
    //     .status(409)
    //     .json({ message: "User with this phone number already exists." });
    // }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create and save the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Store the HASHED password
      phone,
      aadhaar,
    });

    await newUser.save();

    // 5. Create a JWT token for the session
    const token = createToken(newUser._id);

    // 6. Send success response
    res.status(201).json({
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
      message: "Registration successful!",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// ==========================================================
//                 2. LOGIN (UPDATED)
// ==========================================================
export const login = async (req, res) => {
  try {
    // The frontend sends the user's input (email OR phone) in the 'email' field.
    // The frontend sends the user's PIN in the 'password' field.
    const { email: loginInput, password } = req.body;

    // 1. Basic validation
    if (!loginInput || !password) {
      return res
        .status(400)
        .json({ message: "Login identifier and password are required." });
    }

    // 2. Find the user by EITHER email OR phone number
    // We use the '$or' operator to check both fields.
    const user = await User.findOne({
      $or: [{ email: loginInput }, { phone: loginInput }],
    }).select("+password"); // <-- IMPORTANT: .select('+password') is correct

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials." });
    }

    // 3. Compare the provided password (PIN) with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // 4. Create a JWT token
    const token = createToken(user._id);

    // 5. Send success response
    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
      message: "Login successful!",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};
