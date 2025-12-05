import React, { useState } from "react";
// Replaced react-icons/fa with lucide-react icons
import { User, Lock, Mail, Key, Phone, Loader } from "lucide-react";
import { Link } from "react-router-dom";

// IMPORTANT: Define the backend URL for API calls
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
              className="h-max w-14  mr-2 pr-2"
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

const Login = () => {
  const [role, setRole] = useState("individual");

  // State to hold dynamic input values
  const [formData, setFormData] = useState({
    individual_identifier: "",
    individual_password: "",
    issuer_identifier: "",
    issuer_password: "",
    verifier_identifier: "",
    verifier_password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --- Handle input changes ---
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setError("");
    setSuccess("");
  };

  // --- Handle form submission ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    let loginInput;
    let password;

    // Determine which fields to use based on the selected role
    if (role === "individual") {
      loginInput = formData.individual_identifier;
      password = formData.individual_password;
    } else if (role === "issuer") {
      loginInput = formData.issuer_identifier;
      password = formData.issuer_password;
    } else if (role === "verifier") {
      loginInput = formData.verifier_identifier;
      password = formData.verifier_password;
    }

    if (!loginInput || !password) {
      setError("Please enter both the identifier and password/PIN.");
      setIsLoading(false);
      return;
    }

    // Map frontend fields to the backend structure (email/password)
    const payload = {
      email: loginInput, // Backend expects identifier (phone/issuerId/verifierId) in 'email' field
      password: password, // Backend expects password/PIN in 'password' field
    };

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Login failed.`);
      }

      // --- SUCCESSFUL LOGIN ACTION ---
      const userDetails = {
        name: data.user.name,
        email: data.user.email,
        token: data.token,
        role: data.user.role, // Assuming the backend returns the role now
      };
      localStorage.setItem("smartdoc_user", JSON.stringify(userDetails));

      setSuccess(`Login successful! Redirecting to dashboard...`);

      // Determine redirection based on the actual logged-in user's role
      if (userDetails.role === "issuer") {
        window.location.href = "/Issuer";
      } else if (userDetails.role === "verifier") {
        window.location.href = "/verifier-dashboard"; // Example path for verifier
      } else {
        window.location.href = "/individual";
      }
    } catch (err) {
      setError(
        err.message || "Network error. Please check the API server connection.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Render inputs based on role
  const renderInputs = () => {
    switch (role) {
      case "individual":
        return (
          <>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="individual_identifier"
              >
                Phone Number / Email
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Phone className="text-gray-500 mr-2 h-5 w-5" />
                <input
                  id="individual_identifier"
                  type="text"
                  value={formData.individual_identifier}
                  onChange={handleInputChange}
                  className="w-full focus:outline-none"
                  placeholder="Phone Number or Email"
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="individual_password"
              >
                PIN Code
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Lock className="text-gray-500 mr-2 h-5 w-5" />
                <input
                  id="individual_password"
                  type="password"
                  value={formData.individual_password}
                  onChange={handleInputChange}
                  className="w-full focus:outline-none"
                  placeholder="Enter your PIN code"
                  required
                />
              </div>
            </div>
          </>
        );
      case "issuer":
        return (
          <>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="issuer_identifier"
              >
                Issuer ID / Email
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Key className="text-gray-500 mr-2 h-5 w-5" />
                <input
                  id="issuer_identifier"
                  type="text"
                  value={formData.issuer_identifier}
                  onChange={handleInputChange}
                  className="w-full focus:outline-none"
                  placeholder="Enter Issuer ID or Email"
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="issuer_password"
              >
                Password
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Lock className="text-gray-500 mr-2 h-5 w-5" />
                <input
                  id="issuer_password"
                  type="password"
                  value={formData.issuer_password}
                  onChange={handleInputChange}
                  className="w-full focus:outline-none"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
          </>
        );
      case "verifier":
        return (
          <>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="verifier_identifier"
              >
                Verifier ID / Email
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Key className="text-gray-500 mr-2 h-5 w-5" />
                <input
                  id="verifier_identifier"
                  type="text"
                  value={formData.verifier_identifier}
                  onChange={handleInputChange}
                  className="w-full focus:outline-none"
                  placeholder="Enter Verifier ID or Email"
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="verifier_password"
              >
                Password
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Lock className="text-gray-500 mr-2 h-5 w-5" />
                <input
                  id="verifier_password"
                  type="password"
                  value={formData.verifier_password}
                  onChange={handleInputChange}
                  className="w-full focus:outline-none"
                  placeholder="Enter your password"
                  required
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
      {/* FIX: Centering achieved by using margin-top offset equivalent to navbar height (h-20)
         and ensuring vertical centering using justify-center on the parent div. */}
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md mt-20">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Document Verification System
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
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form now calls the submit handler */}
        <form onSubmit={handleAuthSubmit}>
          {renderInputs()}
          <div className="flex items-center justify-between">
            {/* Changed from Link to Button to allow form submission */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin mr-2 h-5 w-5" /> Logging In...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account? {/* Link to /signup is preserved */}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
