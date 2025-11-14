import React, { useState } from "react";
import { CheckCircle, ExternalLink, FileText } from "lucide-react";

const RecentDocuments = ({ documents }) => {
  // Filter documents with "Issued" status
  const verifiedDocuments = documents.filter(
    (doc) => doc.status === "Verified"
  );

  // State to manage document preview
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Function to handle document preview
  const handleDocumentPreview = (doc) => {
    setSelectedDocument(doc);
  };

  // Function to close document preview
  const handleClosePreview = () => {
    setSelectedDocument(null);
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Verified Documents
      </h2>

      {verifiedDocuments.length === 0 ? (
        <p className="text-gray-500 text-center">
          No verified documents found.
        </p>
      ) : (
        <div className="space-y-4">
          {verifiedDocuments.map((doc, index) => (
            <div
              key={index}
              className="group flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex-shrink-0 mr-4">
                <FileText className="w-10 h-10 text-indigo-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {doc.documentType}
                  </h3>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm">Verified</span>
                  </div>
                </div>
                <p className="text-gray-600 mt-1">
                  Issued by: {doc.issuingAuthority}
                </p>
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => handleDocumentPreview(doc)}
                    className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  >
                    View Details
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Preview Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={handleClosePreview}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-indigo-600">
              {selectedDocument.documentType} Details
            </h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700">Name:</span>
                <p>{selectedDocument.name}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Issuing Authority:
                </span>
                <p>{selectedDocument.issuingAuthority}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">IPFS Link:</span>
                <a
                  href={
                    selectedDocument.documentType === "ID Card"
                      ? "https://copper-gigantic-kite-657.mypinata.cloud/ipfs/bafkreiazvovgsz5ekvxq7vhqdjr7kn3u6drfwbunnje3umwfftldr3qfce"
                      : `https://copper-gigantic-kite-657.mypinata.cloud/ipfs/${selectedDocument.ipfsHash}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline break-all"
                >
                  {selectedDocument.documentType === "ID Card"
                    ? "bafkreiazvovgsz5ekvxq7vhqdjr7kn3u6drfwbunnje3umwfftldr3qfce"
                    : selectedDocument.ipfsHash}
                </a>
              </div>
              {selectedDocument.documentType === "Birth Certificate" && (
                <>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Date of Birth:
                    </span>
                    <p>{new Date(selectedDocument.dob).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Place of Birth:
                    </span>
                    <p>{selectedDocument.placeOfBirth}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Registration Number:
                    </span>
                    <p>{selectedDocument.registrationNumber}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RecentDocuments;
