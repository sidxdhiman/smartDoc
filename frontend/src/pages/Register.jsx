import React, { useState } from "react";
// Replaced react-icons/fa with lucide-react icons
import {
  User,
  Lock,
  Mail,
  Key,
  Phone,
  CreditCard,
  Loader,
  UserPlus,
  Building,
  ShieldCheck,
} from "lucide-react";
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
    // FIX: Automatically trim whitespace from inputs to prevent "empty field" errors
    const trimmedValue = value.trimStart();

    setFormData((prev) => ({
      ...prev,
      [roleType]: {
        ...prev[roleType],
        [id]: trimmedValue,
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
    const isIssuer = role === "issuer";
    const isVerifier = role === "verifier";

    let payload = {};
    let requiredFields = [];
    let passwordMatch = true;

    // --- 1. Client-Side Validation and Payload Preparation ---

    if (isIndividual) {
      if (data.pin !== data.confirmPin) {
        setErrorMessage("PINs do not match.");
        passwordMatch = false;
      }
      payload = {
        name: data.name,
        email: data.email,
        password: data.pin, // Map 'pin' state to 'password' field for the backend
        phone: data.phone,
        aadhaar: data.aadhaar,
        role: "individual", // Explicitly define the role for the backend
      };
      // 'password' here refers to the mapped pin value in the payload for validation
      requiredFields = ["name", "email", "password", "phone", "aadhaar"];
    } else if (isIssuer) {
      if (data.password !== data.confirmPassword) {
        setErrorMessage("Passwords do not match.");
        passwordMatch = false;
      }
      payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        issuerId: data.issuerId,
        role: "issuer",
      };
      requiredFields = ["name", "email", "password", "issuerId"];
    } else if (isVerifier) {
      if (data.password !== data.confirmPassword) {
        setErrorMessage("Passwords do not match.");
        passwordMatch = false;
      }
      payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        verifierId: data.verifierId,
        role: "verifier",
      };
      requiredFields = ["name", "email", "password", "verifierId"];
    }

    if (!passwordMatch) {
      setIsLoading(false);
      return;
    }

    // Check for required fields
    const missingField = requiredFields.find(
      // Improved check: convert to string and trim final value to detect emptiness
      (field) => !payload[field] || payload[field].toString().trim() === "",
    );
    if (missingField) {
      // Improve error message clarity
      const fieldName = missingField.replace(/([A-Z])/g, " $1").trim();
      setErrorMessage(`Please fill out the required field: ${fieldName}.`);
      setIsLoading(false);
      return;
    }

    // --- DEBUGGING STEP ADDED ---
    console.log("Submitting payload:", payload);
    // --- DEBUGGING STEP ADDED ---

    // --- 2. API Submission ---
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        // Log the full error response from the server for better diagnosis
        console.error("Server Error Response:", result);
        // If the backend returns an error message, use it.
        throw new Error(
          result.message ||
            "Signup failed due to server error. Check console for details.",
        );
      }

      setSuccessMessage(
        `Registration for ${role} successful! Welcome, ${result.user.name}. Please proceed to login.`,
      );

      // Clear the form data for the submitted role
      setFormData((prev) => ({
        ...prev,
        [role]: Object.fromEntries(
          Object.keys(prev[role]).map((key) => [key, ""]),
        ),
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
    const data = formData[role];
    const roleType = role;

    const createInput = (id, type, placeholder, Icon, isRequired = true) => (
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2 capitalize"
          htmlFor={id}
        >
          {placeholder.replace("Enter your ", "").replace("Create a ", "")}
        </label>
        <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-shadow">
          <Icon className="text-gray-500 mr-2 h-5 w-5" />
          <input
            id={id}
            type={type}
            value={data[id]}
            onChange={(e) => handleInputChange(e, roleType)}
            className="w-full focus:outline-none"
            placeholder={placeholder}
            required={isRequired}
          />
        </div>
      </div>
    );

    switch (role) {
      case "individual":
        return (
          <>
            {createInput("name", "text", "Enter your full name", User)}
            {createInput("phone", "tel", "Enter your phone number", Phone)}
            {createInput("email", "email", "Enter your email address", Mail)}
            {createInput("pin", "password", "Create a PIN Code", Lock)}
            {createInput("confirmPin", "password", "Confirm PIN Code", Lock)}
            {createInput(
              "aadhaar",
              "text",
              "Enter your Aadhaar ID",
              CreditCard,
            )}
          </>
        );
      case "issuer":
        return (
          <>
            {createInput(
              "issuerId",
              "text",
              "Enter your unique Issuer ID",
              Building,
            )}
            {createInput("name", "text", "Enter issuer name", User)}
            {createInput("email", "email", "Enter issuer email", Mail)}
            {createInput("password", "password", "Create a password", Key)}
            {createInput(
              "confirmPassword",
              "password",
              "Confirm password",
              Key,
            )}
          </>
        );
      case "verifier":
        return (
          <>
            {createInput(
              "verifierId",
              "text",
              "Enter your unique Verifier ID",
              ShieldCheck,
            )}
            {createInput("name", "text", "Enter verifier name", User)}
            {createInput("email", "email", "Enter verifier email", Mail)}
            {createInput("password", "password", "Create a password", Key)}
            {createInput(
              "confirmPassword",
              "password",
              "Confirm password",
              Key,
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl mt-24 transform transition-all duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Secure Registration
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
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition-shadow appearance-none"
          >
            <option value="individual">Individual</option>
            <option value="issuer">Issuing Authority</option>
            <option value="verifier">Verifying Authority</option>
          </select>
        </div>

        {/* Status Messages */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm font-medium animate-fadeIn">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm font-medium animate-fadeIn">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleAuthSubmit}>
          {renderInputs()}
          <div className="flex items-center justify-between mt-8">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin mr-2 h-5 w-5" /> Processing...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" /> Sign Up as{" "}
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </>
              )}
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
