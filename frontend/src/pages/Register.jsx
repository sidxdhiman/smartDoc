import React, { useState } from "react";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaKey,
  FaPhone,
  FaIdCard,
  FaSpinner,
  FaUserPlus,
} from "react-icons/fa";
import { Link } from "react-router-dom";

// IMPORTANT: Define the backend URL
const API_BASE_URL = "http://localhost:5000/api";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center justify-center">
            <img
              src="https://img1.digitallocker.gov.in/assets/img/icons/National-Emblem.png"
              className="h-max w-10 border-r-2 mr-2 pr-2 border-black"
              alt="National Emblem"
            />
            <img
              src="/icon.png"
              className="h-max w-14 mr-2 pr-2"
              alt="Smartdoc logo"
            />{" "}
            <span className="ml-3 text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              SmartDoc
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

const SignUp = () => {
  const [role, setRole] = useState("individual");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    individual: {
      name: "",
      email: "",
      pin: "", // Changed from password
      confirmPin: "", // Changed from confirmPassword
      phone: "",
      aadhaar: "",
    },
    issuer: {
      issuerId: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    verifier: {
      verifierId: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleInputChange = (e, roleType) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [roleType]: {
        ...prev[roleType],
        [id]: value,
      },
    }));
    // Clear status messages on input change
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setIsLoading(true);

    const data = formData[role];
    const isIndividual = role === "individual";

    // --- 1. Client-Side Validation ---
    if (isIndividual && data.pin !== data.confirmPin) {
      setErrorMessage("PINs do not match.");
      setIsLoading(false);
      return;
    }
    if (
      isIndividual &&
      (!data.email ||
        !data.pin || // Check for pin
        !data.name ||
        !data.phone ||
        !data.aadhaar)
    ) {
      setErrorMessage("All fields are required for individual signup.");
      setIsLoading(false);
      return;
    }

    // --- 2. Prepare Payload ---
    const payload = isIndividual
      ? {
          name: data.name,
          email: data.email,
          password: data.pin, // Map 'pin' state to 'password' field for the backend
          phone: data.phone,
          aadhaar: data.aadhaar,
        }
      : null; // Only handle individual role for API submission

    if (!payload) {
      setErrorMessage("API integration only available for Individual role.");
      setIsLoading(false);
      return;
    }

    // --- 3. API Submission ---
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Signup failed due to server error.");
      }

      setSuccessMessage(
        `Registration successful! Welcome, ${result.user.name}. Please proceed to login.`,
      );

      // Optionally clear the form here
      setFormData((prev) => ({
        ...prev,
        individual: {
          name: "",
          email: "",
          pin: "",
          confirmPin: "",
          phone: "",
          aadhaar: "",
        },
      }));
    } catch (err) {
      setErrorMessage(
        err.message || "Network error. Could not connect to the server.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputs = () => {
    switch (role) {
      case "individual":
        // Collects all fields required by your backend
        return (
          <>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Full Name
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <FaUser className="text-gray-500 mr-2" />
                <input
                  id="name"
                  type="text"
                  value={formData.individual.name}
                  onChange={(e) => handleInputChange(e, "individual")}
                  className="w-full focus:outline-none"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* --- MOVED UP --- */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="phone"
              >
                Phone Number
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <FaPhone className="text-gray-500 mr-2" />
                <input
                  id="phone"
                  type="tel"
                  value={formData.individual.phone}
                  onChange={(e) => handleInputChange(e, "individual")}
                  className="w-full focus:outline-none"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <FaEnvelope className="text-gray-500 mr-2" />
                <input
                  id="email"
                  type="email"
                  value={formData.individual.email}
                  onChange={(e) => handleInputChange(e, "individual")}
                  className="w-full focus:outline-none"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            {/* --- CHANGED TO PIN --- */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="pin"
              >
                PIN Code
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <FaLock className="text-gray-500 mr-2" />
                <input
                  id="pin"
                  type="password"
                  value={formData.individual.pin}
                  onChange={(e) => handleInputChange(e, "individual")}
                  className="w-full focus:outline-none"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            {/* --- CHANGED TO PIN --- */}
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="confirmPin"
              >
                Confirm PIN Code
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <FaLock className="text-gray-500 mr-2" />
                <input
                  id="confirmPin"
                  type="password"
                  value={formData.individual.confirmPin}
                  onChange={(e) => handleInputChange(e, "individual")}
                  className="w-full focus:outline-none"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="aadhaar"
              >
                Aadhaar ID
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <FaIdCard className="text-gray-500 mr-2" />
                <input
                  id="aadhaar"
                  type="text"
                  value={formData.individual.aadhaar}
                  onChange={(e) => handleInputChange(e, "individual")}
                  className="w-full focus:outline-none"
                  placeholder="Enter your Aadhaar ID"
                  required
                />
              </div>
            </div>
          </>
        );
      case "issuer":
        // Static UI preserved for Issuer
        return (
          <>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="issuerId"
              >
                Issuer ID
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <FaIdCard className="text-gray-500 mr-2" />
                <input
                  id="issuerId"
                  type="text"
                  value={formData.issuer.issuerId}
                  onChange={(e) => handleInputChange(e, "issuer")}
                  className="w-full focus:outline-none"
                  placeholder="Enter your unique Issuer ID"
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <FaUser className="text-gray-500 mr-2" />
                <input
                  id="name"
                  type="text"
                  value={formData.issuer.name}
                  onChange={(e) => handleInputChange(e, "issuer")}
                  className="w-full focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <FaEnvelope className="text-gray-500 mr-2" />
                <input
                  id="email"
                  type="email"
                  value={formData.issuer.email}
                  onChange={(e) => handleInputChange(e, "issuer")}
                  className="w-full focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <FaLock className="text-gray-500 mr-2" />
                <input
                  id="password"
                  type="password"
                  value={formData.issuer.password}
                  onChange={(e) => handleInputChange(e, "issuer")}
                  className="w-full focus:outline-none"
                  placeholder="Create your password"
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <FaLock className="text-gray-500 mr-2" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.issuer.confirmPassword}
                  onChange={(e) => handleInputChange(e, "issuer")}
                  className="w-full focus:outline-none"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </>
        );
      case "verifier":
        // Static UI preserved for Verifier
        return (
          <>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="verifierId"
              >
                Verifier ID
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <FaIdCard className="text-gray-500 mr-2" />
                <input
                  id="verifierId"
                  type="text"
                  value={formData.verifier.verifierId}
                  onChange={(e) => handleInputChange(e, "verifier")}
                  className="w-full focus:outline-none"
                  placeholder="Enter your unique Verifier ID"
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <FaUser className="text-gray-500 mr-2" />
                <input
                  id="name"
                  type="text"
                  value={formData.verifier.name}
                  onChange={(e) => handleInputChange(e, "verifier")}
                  className="w-full focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <FaEnvelope className="text-gray-500 mr-2" />
                <input
                  id="email"
                  type="email"
                  value={formData.verifier.email}
                  onChange={(e) => handleInputChange(e, "verifier")}
                  className="w-full focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <FaLock className="text-gray-500 mr-2" />
                <input
                  id="password"
                  type="password"
                  value={formData.verifier.password}
                  onChange={(e) => handleInputChange(e, "verifier")}
                  className="w-full focus:outline-none"
                  placeholder="Create your password"
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <FaLock className="text-gray-500 mr-2" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.verifier.confirmPassword}
                  onChange={(e) => handleInputChange(e, "verifier")}
                  className="w-full focus:outline-none"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md mt-20">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Sign Up - Document Verification System
        </h2>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="role"
          >
            Select Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="individual">Individual</option>
            <option value="issuer">Issuing Authority</option>
            <option value="verifier">Verifying Authority</option>
          </select>
        </div>

        {/* Status Messages */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleAuthSubmit}>
          {renderInputs()}
          <div className="flex items-center justify-between mt-6">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Registering...
                </>
              ) : (
                <>
                  <FaUserPlus className="mr-2" /> Sign Up
                </>
              )}
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
