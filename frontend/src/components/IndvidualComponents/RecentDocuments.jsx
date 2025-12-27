import React, { useState } from "react";
import { CheckCircle, FileText, Clock, XCircle, Download, ExternalLink } from "lucide-react";

const RecentDocuments = ({ documents = [] }) => {
  // ✅ 1. REMOVED the "Verified Only" filter. 
  // We want to see ALL documents (Pending, Verified, Issued)
  
  // Optional: You can sort them by date if you want
  const sortedDocs = [...documents].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const [selectedDocument, setSelectedDocument] = useState(null);

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        My Documents
      </h2>

      {sortedDocs.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No documents found. Upload one to get started!
        </p>
      ) : (
        <div className="space-y-4">
          {sortedDocs.map((doc, index) => (
            <div
              key={index}
              className="group flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all duration-200"
            >
              {/* Icon */}
              <div className="flex-shrink-0 mr-4">
                <div className="bg-indigo-50 p-3 rounded-full">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
              </div>

              {/* Main Info */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">
                    {doc.documentType}
                  </h3>
                  
                  {/* Dynamic Status Badge */}
                  <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
                    doc.status === 'ISSUED' ? 'bg-green-100 text-green-700' :
                    doc.status === 'VERIFIED' ? 'bg-blue-100 text-blue-700' :
                    doc.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {doc.status === 'ISSUED' && <CheckCircle className="w-4 h-4 mr-1" />}
                    {doc.status === 'VERIFIED' && <CheckCircle className="w-4 h-4 mr-1" />}
                    {doc.status === 'PENDING' && <Clock className="w-4 h-4 mr-1" />}
                    {doc.status === 'REJECTED' && <XCircle className="w-4 h-4 mr-1" />}
                    {doc.status}
                  </div>
                </div>

                <p className="text-gray-600 mt-1 text-sm">
                  Issued by: {doc.issuingAuthority || "Pending Authority"}
                </p>

                {/* ✅ ACTION BUTTONS */}
                <div className="mt-3 flex space-x-3">
                  
                  {/* 1. View Details (Metadata) */}
                  <button
                    onClick={() => setSelectedDocument(doc)}
                    className="flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                  >
                    View Details
                  </button>

                  {/* 2. ✅ VIEW CERTIFICATE (Only if ISSUED) */}
                  {doc.status === "ISSUED" && doc.issuedDocumentUrl && (
                    <a
                      href={`${import.meta.env.VITE_BACKEND_URL}/${doc.issuedDocumentUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm shadow-sm"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      View Certificate
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal (Preserved your style) */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setSelectedDocument(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-indigo-600">
              {selectedDocument.documentType} Details
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Name:</span>
                <p>{selectedDocument.name}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Aadhaar:</span>
                <p>{selectedDocument.aadhaar}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Status:</span>
                <p className="capitalize">{selectedDocument.status}</p>
              </div>
              {/* Show file link in modal too if available */}
              {selectedDocument.issuedDocumentUrl && (
                 <div className="pt-2">
                    <span className="font-semibold text-gray-700 block mb-1">Digital Copy:</span>
                    <a 
                      href={`${import.meta.env.VITE_BACKEND_URL}/${selectedDocument.issuedDocumentUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 underline break-all"
                    >
                      Open Document
                    </a>
                 </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RecentDocuments;