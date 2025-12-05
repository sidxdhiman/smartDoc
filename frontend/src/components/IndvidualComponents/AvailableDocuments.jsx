import React, { useState } from "react";
import axios from "axios";

const AvailableDocuments = () => {
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [uploading, setUploading] = useState(false);

  // 🧩 Mock upload handler (simulate file upload)
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    // Mock delay
    setTimeout(() => {
      const newDoc = {
        id: Date.now(),
        name: file.name,
        type: "Marksheet", // just an example
        uploadedAt: new Date().toLocaleString(),
        sent: false,
      };
      setUploadedDocs((prev) => [...prev, newDoc]);
      setUploading(false);
    }, 1200);
  };

  // ✅ Send document request
  const handleSendRequest = async (doc) => {
    try {
      const userJson = localStorage.getItem("smartdoc_user");
      if (!userJson) return alert("You must be logged in!");

      const { token, name, phone, aadhaar, role } = JSON.parse(userJson);

      const payload = {
        name,
        phone: phone || "9876543210",
        aadhaar: aadhaar || "123412341234",
        documentType: doc.type,
        issuingAuthority: "University of Delhi",
        role,
      };

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/requestdoc`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert(`✅ Request sent for ${doc.name}`);
      setUploadedDocs((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, sent: true } : d)),
      );
    } catch (err) {
      console.error("Error sending request:", err);
      alert("❌ Failed to send document request.");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-3">📂 Upload Documents</h2>

      <label className="block mb-4">
        <span className="text-sm text-gray-600">
          Select a document to upload:
        </span>
        <input
          type="file"
          onChange={handleUpload}
          disabled={uploading}
          className="block mt-2 text-sm text-gray-800"
        />
      </label>

      {uploading && (
        <p className="text-indigo-600 text-sm mb-3 animate-pulse">
          Uploading...
        </p>
      )}

      {uploadedDocs.length > 0 && (
        <div>
          <h3 className="text-md font-semibold mb-2">Uploaded Documents</h3>
          <ul className="space-y-3">
            {uploadedDocs.map((doc) => (
              <li
                key={doc.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-xs text-gray-500">{doc.uploadedAt}</p>
                </div>
                {doc.sent ? (
                  <span className="text-green-600 text-sm font-medium">
                    ✅ Request Sent
                  </span>
                ) : (
                  <button
                    onClick={() => handleSendRequest(doc)}
                    className="px-4 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Send Request
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AvailableDocuments;
