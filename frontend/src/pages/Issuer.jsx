import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/IssuerSidebar";
import {
  DocumentTemplates,
  BulkDocumentIssuance,
  Analytics,
  Settings,
} from "@/components/IssuerPageComponents";

// --- Dashboard Page (Shows Pending Requests) ---
const DashboardPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchRequests();
  }, []);

  if (loading)
    return (
      <div className="p-8 text-gray-600 animate-pulse">Loading requests...</div>
    );

  if (error)
    return (
      <div className="p-8 text-red-600 bg-red-100 border border-red-300 rounded">
        {error}
      </div>
    );

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">
        📄 Pending Document Requests
      </h2>

      {requests.length === 0 ? (
        <p className="text-gray-500">No pending document requests.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="p-4 bg-white shadow-sm border border-gray-200 rounded-lg flex justify-between items-center hover:shadow-md transition-all"
            >
              <div>
                <p className="font-semibold text-gray-800">{req.name}</p>
                <p className="text-sm text-gray-600">
                  {req.documentType} • {req.aadhaar}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(req.createdAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  req.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : req.status === "Verified"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {req.status}
              </span>
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
