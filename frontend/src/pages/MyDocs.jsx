import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaEye, FaFileAlt } from "react-icons/fa";

const MyDocuments = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestDetails, setRequestDetails] = useState({
    documentType: "",
    issuingAuthority: "",
    additionalInfo: "",
  });

  const documents = [
    {
      id: 1,
      name: "Birth Certificate",
      status: "Verified",
      issuedBy: "Municipal Corporation",
      aiScore: 95,
    },
    {
      id: 2,
      name: "Class X Marksheet",
      status: "Pending",
      issuedBy: "CBSE Board",
      aiScore: 75,
    },
    // Add more documents as needed
  ];

  const handlePreview = (doc) => {
    setSelectedDocument(doc);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedDocument(null);
  };

  const handleRequestDocument = () => {
    setShowRequestModal(true);
  };

  const handleRequestSubmit = () => {
    // Simulate request submission
    console.log("Request submitted:", requestDetails);
    setShowRequestModal(false);
    setRequestDetails({
      documentType: "",
      issuingAuthority: "",
      additionalInfo: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">My Documents</h1>

        {/* Table of documents */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Document Name</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Issued By</th>
                <th className="py-3 px-6 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="bg-gray-50 border-b">
                  <td
                    className="py-3 px-6 cursor-pointer"
                    onClick={() => handlePreview(doc)}
                  >
                    {doc.name}
                  </td>
                  <td
                    className={`py-3 px-6 flex items-center ${
                      doc.status === "Verified"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {doc.status === "Verified" ? (
                      <FaCheckCircle className="mr-2" />
                    ) : (
                      <FaTimesCircle className="mr-2" />
                    )}
                    {doc.status} (AI Score: {doc.aiScore})
                  </td>
                  <td className="py-3 px-6">{doc.issuedBy}</td>
                  <td className="py-3 px-6 flex space-x-2">
                    <button
                      onClick={() => handlePreview(doc)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      <FaEye /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={handleRequestDocument}
          className="bg-yellow-500 text-white p-3 rounded mt-10 flex flex-row gap-2 text-xl items-center"
        >
          <FaFileAlt /> Request Document
        </button>
        {/* Document Preview Modal */}
        {showPreview && selectedDocument && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-1/2">
              <h2 className="text-xl font-bold mb-4">
                {selectedDocument.name} - Preview
              </h2>
              <p>
                <strong>Status:</strong> {selectedDocument.status}
              </p>
              <p>
                <strong>Issued By:</strong> {selectedDocument.issuedBy}
              </p>
              <p>
                <strong>AI Score:</strong> {selectedDocument.aiScore}
              </p>
              <p className="mt-4">[Document preview content goes here...]</p>
              <button
                onClick={handleClosePreview}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Request Document Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-1/3">
              <h2 className="text-xl font-bold mb-4">Request Document</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Type
                </label>
                <input
                  type="text"
                  value={requestDetails.documentType}
                  onChange={(e) =>
                    setRequestDetails({
                      ...requestDetails,
                      documentType: e.target.value,
                    })
                  }
                  className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
                  placeholder="e.g. Birth Certificate, Marksheet"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issuing Authority
                </label>
                <input
                  type="text"
                  value={requestDetails.issuingAuthority}
                  onChange={(e) =>
                    setRequestDetails({
                      ...requestDetails,
                      issuingAuthority: e.target.value,
                    })
                  }
                  className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
                  placeholder="e.g. Municipal Corporation, CBSE Board"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information
                </label>
                <textarea
                  value={requestDetails.additionalInfo}
                  onChange={(e) =>
                    setRequestDetails({
                      ...requestDetails,
                      additionalInfo: e.target.value,
                    })
                  }
                  className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
                  placeholder="Any additional details you want to provide"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestSubmit}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Request Document
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDocuments;
