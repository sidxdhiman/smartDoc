import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaKey, FaPhone, FaIdCard } from "react-icons/fa";
import { Link } from "react-router-dom";

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
  const [formData, setFormData] = useState({
    individual: {
      phone: "",
      pin: "",
      confirmPin: ""
    },
    issuer: {
      issuerId: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    verifier: {
      verifierId: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const handleInputChange = (e, roleType) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [roleType]: {
        ...prev[roleType],
        [id]: value
      }
    }));
  };

  const renderInputs = () => {
    switch (role) {
      case "individual":
        return (
          <>
            <Navbar />
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
                />
              </div>
            </div>
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
                  placeholder="Create your PIN code"
                />
              </div>
            </div>
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
                  placeholder="Confirm your PIN code"
                />
              </div>
            </div>
          </>
        );
      case "issuer":
        return (
          <>
            <Navbar />
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
        return (
          <>
            <Navbar />
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement validation logic here
    console.log("Form submitted", formData[role]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
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
        <form onSubmit={handleSubmit}>
          {renderInputs()}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign Up
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