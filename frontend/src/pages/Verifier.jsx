import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FileText, Home, BarChart2, Users, Zap, Clock, CheckCircle, XCircle, Bell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Simple UI Components (Inlined to prevent import errors)
const Badge = ({ children, className }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${className}`}>
    {children}
  </span>
);

const VerifierDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch Data Function
  const fetchRequests = async () => {
    try {
      const userJson = localStorage.getItem("smartdoc_user");
      if (!userJson) return;
      const { token } = JSON.parse(userJson);

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/verify/requests`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequests(res.data.requests || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Failed to load requests.");
      setLoading(false);
    }
  };

  // 2. Initial Load
  useEffect(() => {
    fetchRequests();
  }, []);

  // 3. Verify Function (The one that was broken)
  const handleVerify = async (requestId) => {
    if (!confirm("Are you sure you want to verify this document?")) return;

    try {
      console.log("Sending Verify Request for ID:", requestId);
      
      const userJson = localStorage.getItem("smartdoc_user");
      const { token } = JSON.parse(userJson);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/verify/verify`,
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Response:", res.data);
      alert("✅ Document Verified Successfully!");
      
      // Refresh the list immediately
      fetchRequests();

    } catch (err) {
      console.error("Verification Error:", err);
      alert(`❌ Failed: ${err.response?.data?.message || err.message}`);
    }
  };

  // --- METRICS CALCULATION ---
  const totalDocs = requests.length;
  const verifiedDocs = requests.filter(r => r.status === "VERIFIED" || r.status === "ISSUED").length;
  const pendingDocs = requests.filter(r => r.status === "PENDING").length;
  const rejectedDocs = requests.filter(r => r.status === "REJECTED").length;

  // --- SEPARATE LISTS ---
  const pendingList = requests.filter(r => r.status === "PENDING");
  const historyList = requests.filter(r => r.status !== "PENDING"); // Verified, Issued, Rejected

  if (loading) return <div className="p-10 text-center">Loading Verifier Dashboard...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* SIDEBAR (Simple) */}
      <aside className="w-64 bg-indigo-900 text-white hidden md:block">
        <div className="p-6 text-2xl font-bold border-b border-indigo-800">SmartDoc</div>
        <nav className="p-4 space-y-2">
          <button className="flex items-center gap-3 w-full px-4 py-3 bg-indigo-800 rounded-lg"><Home size={20}/> Dashboard</button>
          <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-indigo-800 rounded-lg text-indigo-100"><FileText size={20}/> Documents</button>
          <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-indigo-800 rounded-lg text-indigo-100"><Users size={20}/> Users</button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Verifier Dashboard</h1>
          <div className="flex items-center gap-4">
            <Bell className="text-gray-500" />
            <Avatar><AvatarImage src="" /><AvatarFallback>VD</AvatarFallback></Avatar>
          </div>
        </header>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-blue-50 border-blue-100">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-blue-600 font-medium">Total</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold text-blue-900">{totalDocs}</div></CardContent>
          </Card>
          <Card className="bg-green-50 border-green-100">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-green-600 font-medium">Verified</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold text-green-900">{verifiedDocs}</div></CardContent>
          </Card>
          <Card className="bg-yellow-50 border-yellow-100">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-yellow-600 font-medium">Pending</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold text-yellow-900">{pendingDocs}</div></CardContent>
          </Card>
          <Card className="bg-red-50 border-red-100">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-red-600 font-medium">Rejected</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold text-red-900">{rejectedDocs}</div></CardContent>
          </Card>
        </div>

        {/* --- PENDING TASKS SECTION --- */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="text-yellow-600" /> Pending Verifications
          </h2>
          
          {pendingList.length === 0 ? (
             <div className="p-8 bg-white rounded-xl shadow-sm border text-center text-gray-500">
               No pending documents to verify.
             </div>
          ) : (
            <div className="space-y-4">
              {pendingList.map((req) => (
                <div key={req._id} className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 flex justify-between items-center hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 capitalize">{req.documentType}</h3>
                    <p className="text-gray-600 text-sm">Applicant: {req.name}</p>
                    <p className="text-gray-400 text-xs mt-1">ID: {req._id}</p>
                  </div>
                  
                  {/* ✅ STANDARD HTML BUTTON (To avoid component conflicts) */}
                  <button
                    onClick={() => handleVerify(req._id)}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg shadow-sm transition-colors"
                  >
                    Verify Document
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- RECENT ACTIVITY (HISTORY) --- */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText className="text-gray-600" /> Recent Activity
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             {historyList.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No history yet.</div>
             ) : (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Document</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {historyList.map(req => (
                      <tr key={req._id}>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900 capitalize">{req.documentType}</p>
                          <p className="text-xs text-gray-500">{req.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={
                            req.status === 'VERIFIED' || req.status === 'ISSUED' ? "bg-green-100 text-green-800" :
                            req.status === 'REJECTED' ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                          }>
                            {req.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-gray-500">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default VerifierDashboard;