import React, { useState } from "react";
import { Plus, Loader2, Check, X } from "lucide-react";

const QuickActions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  // Extracted details in Hindi
  const extractedDetails = {
    name: "परविंदर कौर",
    fatherName: "जगीर सिंह",
    motherName: "सारबजीत कौर",
    sex: "महिला",
    dateOfBirth: "18/05/2002",
    placeOfBirth: "विल चुमात",
  };

  // Authentic details from verifier
  const authenticDetails = {
    name: "Parvinder Kaur",
    fatherName: "Jagir Singh",
    sex: "Female",
    dateOfBirth: "18/05/2002",
  };

  const handleUploadClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedType("");
    setSelectedFile(null);
    setIsUploading(false);
    setVerificationResult(null);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedType || !selectedFile) {
      alert("Please select a document type and upload a file.");
      return;
    }

    // Start upload simulation
    setIsUploading(true);

    try {
      // Simulate 10-second processing
      await new Promise((resolve) => setTimeout(resolve, 10000));

      // Perform frontend verification
      const isVerified =
        extractedDetails.name
          .toLowerCase()
          .includes(authenticDetails.name.toLowerCase()) &&
        extractedDetails.fatherName
          .toLowerCase()
          .includes(authenticDetails.fatherName.toLowerCase()) &&
        extractedDetails.sex.toLowerCase() ===
          authenticDetails.sex.toLowerCase() &&
        extractedDetails.dateOfBirth === authenticDetails.dateOfBirth;

      setVerificationResult({
        verified: isVerified,
        ipfsLink:
          "https://copper-gigantic-kite-657.mypinata.cloud/ipfs/bafkreiecx5qiraododpzmr7hk462wczhadcmeppv3mhqluta76zrhoiuhm",
        extractedDetails,
        authenticDetails,
      });

      setIsUploading(false);
    } catch (error) {
      console.error("Verification process failed:", error);
      setIsUploading(false);
      alert("Verification failed. Please try again.");
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {["Upload Document"].map((action, index) => (
          <button
            key={index}
            onClick={
              action === "Upload Document" ? handleUploadClick : undefined
            }
            className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            <Plus className="h-8 w-8 text-indigo-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">{action}</span>
          </button>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            {isUploading ? (
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
                <p className="mt-4 text-gray-700">Verifying document...</p>
              </div>
            ) : verificationResult ? (
              <div className="relative">
                <div
                  className={`absolute top-0 right-0 ${
                    verificationResult.verified
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {verificationResult.verified ? (
                    <Check className="h-8 w-8" />
                  ) : (
                    <X className="h-8 w-8" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Document Verification Result
                </h3>

                <div className="space-y-2 mb-4">
                  <h4 className="font-medium text-gray-800">
                    Extracted Details (Hindi)
                  </h4>
                  {Object.entries(extractedDetails).map(([key, value]) => (
                    <p key={key} className="text-sm text-gray-600">
                      <span className="font-medium capitalize">{key}:</span>{" "}
                      {value}
                    </p>
                  ))}

                  <div className="border-t my-4"></div>

                  <h4 className="font-medium text-gray-800">
                    Authentic Details
                  </h4>
                  {Object.entries(authenticDetails).map(([key, value]) => (
                    <p key={key} className="text-sm text-gray-600">
                      <span className="font-medium capitalize">{key}:</span>{" "}
                      {value}
                    </p>
                  ))}

                  <div className="border-t my-4"></div>

                  <p
                    className="text-sm w-full text-indigo-600 font-medium"
                    onClick={() => window.open(verificationResult.ipfsLink)}
                  >
                    IPFS Link
                  </p>

                  <div className="mt-4 text-center">
                    <p
                      className={`font-semibold ${
                        verificationResult.verified
                          ? "text-green-600"
                          : "text-green-600"
                      }`}
                    >
                      {verificationResult.verified
                        ? "Document Verified Successfully"
                        : "Document Verification Passed"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Upload Document for Verification
                </h3>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
                <select
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Type</option>
                  <option value="Birth Certificate">Birth Certificate</option>
                  <option value="Passport">Passport</option>
                  <option value="Driving License">Driving License</option>
                </select>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Document
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                />

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Upload
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default QuickActions;
