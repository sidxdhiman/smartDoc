import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/IssuerSidebar";
import {
  DocumentTemplates,
  BulkDocumentIssuance,
  Analytics,
  Settings,
} from "@/components/IssuerPageComponents";
import { CheckCircle, Clock, XCircle, FileText } from "lucide-react";

// --- Dashboard Page (Split View: To-Do vs History) ---
const DashboardPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch ALL requests for the Issuer
  const fetchRequests = async () => {
    try {
      const userJson = localStorage.getItem("smartdoc_user");
      if (!userJson) return;
      const { token } = JSON.parse(userJson);

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/issue/requests`,
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

  // 2. Handle Issue / Reject
  const handleUpdateStatus = async (id, status) => {
    try {
      const userJson = localStorage.getItem("smartdoc_user");
      if (!userJson) return;
      const { token } = JSON.parse(userJson);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/issue/issue`,
        { requestId: id, status: status },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert(res.data.message || "Certificate Issued Successfully!");
      fetchRequests(); // Refresh the list immediately
    } catch (err) {
      console.error("Error updating request:", err);
      alert("Failed to update request status");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <div className="p-8 text-gray-500 animate-pulse">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-red-600 bg-red-50 border border-red-200 rounded-lg">{error}</div>;

  // ✅ LOGIC: Split the list
  // "Pending Action" = Status is 'VERIFIED' (Passed by Verifier, waiting for Issuer)
  // "History" = Status is 'ISSUED' or 'REJECTED'
  const pendingAction = requests.filter(req => req.status === "VERIFIED");
  const history = requests.filter(req => req.status === "ISSUED" || req.status === "REJECTED");

  return (
    <div className="p-8 max-w-7xl mx-auto">
      
      {/* SECTION 1: ACTION REQUIRED */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          🚀 Ready for Issuance
          <span className="bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full">{pendingAction.length}</span>
        </h2>

        {pendingAction.length === 0 ? (
          <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-500">
            No verified documents waiting for issuance right now.
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingAction.map((req) => (
              <div key={req._id} className="p-6 bg-white shadow-sm border border-gray-100 border-l-4 border-l-indigo-500 rounded-lg flex flex-col md:flex-row justify-between items-center hover:shadow-md transition-all">
                <div className="mb-4 md:mb-0">
                  <h3 className="font-bold text-lg text-gray-900 capitalize">{req.documentType}</h3>
                  <p className="text-gray-600">Applicant: <span className="font-medium">{req.name}</span></p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">Aadhaar: {req.aadhaar}</span>
                    <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> VERIFIED
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdateStatus(req._id, "Issued")}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 shadow-md transition-all font-medium flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Issue Certificate
                  </button>
                  <button
                     onClick={() => handleUpdateStatus(req._id, "Rejected")}
                     className="text-red-600 px-4 py-2 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: HISTORY */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-t pt-8">📜 Issuance History</h2>
        {history.length === 0 ? (
          <p className="text-gray-500">No issuance history available.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Document</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Applicant</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 capitalize">{req.documentType}</td>
                    <td className="px-6 py-4 text-gray-600">{req.name}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{new Date(req.updatedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        req.status === 'ISSUED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {req.status === 'ISSUED' ? <CheckCircle className="w-3 h-3 mr-1"/> : <XCircle className="w-3 h-3 mr-1"/>}
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Layout ---
const IssuerDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "templates": return <DocumentTemplates />;
      case "bulk": return <BulkDocumentIssuance />;
      case "analytics": return <Analytics />;
      case "settings": return <Settings />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
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