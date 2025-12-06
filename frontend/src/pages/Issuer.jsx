import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/IssuerSidebar";
import {
  DocumentTemplates,
  BulkDocumentIssuance,
  Analytics,
  Settings,
} from "@/components/IssuerPageComponents";

// --- Dashboard Page (Shows Pending Requests + Actions) ---
const DashboardPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch all document requests for issuer
  const fetchRequests = async () => {
    try {
      const userJson = localStorage.getItem("smartdoc_user");
      if (!userJson) return;
      const { token } = JSON.parse(userJson);

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/allrequests`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Error fetching issuer requests:", err);
      setError("Failed to load document requests");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Send for Verification or Deny
  const handleUpdateStatus = async (id, status) => {
    try {
      const userJson = localStorage.getItem("smartdoc_user");
      if (!userJson) return;
      const { token } = JSON.parse(userJson);

      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/updaterequest`,
        { requestId: id, newStatus: status },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Success alert
      alert(res.data.message || "Status updated successfully!");
      // Refresh list
      fetchRequests();
    } catch (err) {
      console.error("Error updating request:", err);
      alert("Failed to update request status");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 🌀 Loading state
  if (loading)
    return (
      <div className="p-8 text-gray-600 animate-pulse">Loading requests...</div>
    );

  // ❌ Error state
  if (error)
    return (
      <div className="p-8 text-red-600 bg-red-100 border border-red-300 rounded">
        {error}
      </div>
    );

  // ✅ UI Rendering
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">
        📄 Pending Document Requests
      </h2>

      {requests.length === 0 ? (
        <p className="text-gray-500">No document requests found.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="p-5 bg-white shadow-sm border border-gray-200 rounded-xl hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="font-semibold text-gray-800 text-lg">
                    {req.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {req.documentType} • Aadhaar: {req.aadhaar}
                  </p>
                  <p className="text-xs text-gray-400">
                    Requested on {new Date(req.createdAt).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    req.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : req.status === "Verified"
                        ? "bg-green-100 text-green-700"
                        : req.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : req.status === "SentToVerifier"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {req.status}
                </span>
              </div>

              {/* ✅ Show actions only for Pending requests */}
              {req.status === "Pending" && (
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() =>
                      handleUpdateStatus(req._id, "SentToVerifier")
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Send for Verification
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(req._id, "Rejected")}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                  >
                    Deny Request
                  </button>
                </div>
              )}

              {/* 🔵 Show note if already processed */}
              {req.status !== "Pending" && (
                <p className="text-sm text-gray-500 mt-2 italic">
                  This request has already been processed.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Issuer Dashboard Layout ---
const IssuerDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "templates":
        return <DocumentTemplates />;
      case "bulk":
        return <BulkDocumentIssuance />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <Settings />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        onHomeClick={() => setActiveTab("dashboard")}
        onTemplatesClick={() => setActiveTab("templates")}
        onBulkIssuanceClick={() => setActiveTab("bulk")}
        onAnalyticsClick={() => setActiveTab("analytics")}
        onSettingsClick={() => setActiveTab("settings")}
      />
      <div className="flex-1 ml-72 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};

export default IssuerDashboard;
