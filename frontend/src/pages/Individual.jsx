import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas"; // ✅ Import html2canvas

import Sidebar from "../components/IndvidualComponents/Sidebar";
import Header from "../components/IndvidualComponents/Header";
import QuickActions from "../components/IndvidualComponents/QuickActions";
import RecentDocuments from "../components/IndvidualComponents/RecentDocuments";
import SearchDocuments from "../components/IndvidualComponents/SearchDocuments";
import Settings from "../components/IndvidualComponents/Settings";
import AvailableDocuments from "../components/IndvidualComponents/AvailableDocuments";

// ✅ Import Logo from Assets
import logoUrl from "../../assets/logo.png";
// ✅ Emblem for the "Government" look (Optional: replace with your own or use this placeholder)
const emblemUrl =
  "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("home");
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ State for the "DigiLocker-style" Viewer
  const [viewingDoc, setViewingDoc] = useState(null);

  // ✅ Ref for the certificate element we want to download
  const certificateRef = useRef(null);

  const navigate = useNavigate();

  // 1. Fetch User
  useEffect(() => {
    const userJson = localStorage.getItem("smartdoc_user");
    if (!userJson) {
      navigate("/login");
      return;
    }
    try {
      const user = JSON.parse(userJson);
      setCurrentUser(user);
    } catch {
      localStorage.removeItem("smartdoc_user");
      navigate("/login");
    }
  }, [navigate]);

  // 2. Heavy Fetch
  const fetchAllData = async () => {
    if (!currentUser?.token) return;
    try {
      if (documents.length === 0) setIsLoading(true);
      setError(null);
      const token = currentUser.token;
      const profileResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const docsResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/myrequests`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setDocuments(docsResponse.data.requests || []);
      setCurrentUser({ ...profileResponse.data, token });
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err);
      setIsLoading(false);
      if (err.response?.status === 401) {
        localStorage.removeItem("smartdoc_user");
        navigate("/login");
      }
    }
  };

  // 3. Background Refresh
  useEffect(() => {
    if (!currentUser?.token) return;
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/myrequests`,
          { headers: { Authorization: `Bearer ${currentUser.token}` } },
        );
        setDocuments(res.data.requests || []);
      } catch (e) {
        console.error("Auto-refresh failed", e);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [currentUser?.token]);

  // 4. Initial Load
  useEffect(() => {
    if (currentUser?.token) fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.token]);

  const handleLogout = () => {
    localStorage.removeItem("smartdoc_user");
    navigate("/login");
  };

  const isVerified = (status) => {
    if (!status) return false;
    const s = status.toUpperCase();
    return s === "VERIFIED" || s === "ISSUED";
  };

  // ✅ DOWNLOAD FUNCTION
  const handleDownloadImage = async () => {
    if (certificateRef.current) {
      try {
        const canvas = await html2canvas(certificateRef.current, {
          useCORS: true, // Important for external images
          scale: 2, // Higher quality
          backgroundColor: "#ffffff",
        });
        const link = document.createElement("a");
        link.download = `SmartDoc_${viewingDoc.documentType || "Certificate"}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (err) {
        console.error("Failed to generate image", err);
        alert("Could not generate image. Please try again.");
      }
    }
  };

  if (isLoading || !currentUser)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        handleLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto bg-gray-100 p-8 relative">
        <Header user={currentUser} />

        {selectedTab === "home" && (
          <>
            <QuickActions />
            <br />
            <AvailableDocuments />
            <br />
            {error ? (
              <div className="text-red-600">{error.message}</div>
            ) : (
              <RecentDocuments documents={documents} />
            )}
          </>
        )}

        {selectedTab === "documents" && (
          <>
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Issued Documents
            </h3>
            {documents.length === 0 ? (
              <p className="text-gray-500">No documents found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc) => {
                  const verified = isVerified(doc.status);
                  return (
                    <div
                      key={doc._id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                    >
                      <div className="p-5 flex items-start space-x-4">
                        <div className="p-3 bg-indigo-50 rounded-lg">
                          <svg
                            className="w-8 h-8 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 text-lg">
                            {doc.documentType || "Document"}
                          </h4>
                          <p className="text-sm text-gray-500 truncate mt-1">
                            ID: {doc._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                      <div className="px-5 pb-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                        >
                          {verified ? "✓ Verified" : "⚠ Pending"}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-4 border-t border-gray-100">
                        <button
                          disabled={!verified}
                          onClick={() => setViewingDoc(doc)}
                          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${verified ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                        >
                          {verified ? "View Digital Copy" : "Processing..."}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ✅ GENERATED CERTIFICATE MODAL */}
        {viewingDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm">
            <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl flex flex-col overflow-hidden animate-fadeIn">
              {/* Toolbar */}
              <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
                <h2 className="text-lg font-bold">
                  SmartDoc Digital Generator
                </h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleDownloadImage}
                    className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded text-sm font-semibold flex items-center transition"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download Digital Copy
                  </button>
                  <button
                    onClick={() => setViewingDoc(null)}
                    className="text-gray-400 hover:text-white text-2xl font-bold"
                  >
                    &times;
                  </button>
                </div>
              </div>

              {/* Scrollable Area */}
              <div className="flex-1 bg-gray-100 overflow-y-auto p-8 flex justify-center items-start">
                {/* ✅ THE CERTIFICATE TEMPLATE
                    This entire div is what gets converted to an image.
                */}
                <div
                  ref={certificateRef}
                  className="bg-white w-[800px] h-[550px] shadow-2xl relative p-8 border-4 border-double border-gray-300 flex flex-col justify-between"
                  style={{ fontFamily: "'Times New Roman', serif" }} // Official Font
                >
                  {/* 1. Header Section */}
                  <div className="flex justify-between items-center border-b-2 border-gray-800 pb-4 mb-4">
                    <div className="text-left">
                      <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-wider">
                        SmartDoc Govt
                      </h1>
                      <p className="text-sm font-semibold text-gray-600 tracking-widest uppercase">
                        Digital Document Service
                      </p>
                    </div>
                    <img
                      src={emblemUrl}
                      alt="Emblem"
                      className="h-20 object-contain opacity-90"
                      crossOrigin="anonymous"
                    />
                    <div className="text-right">
                      <h2 className="text-xl font-bold text-gray-800">
                        GOVT. OF INDIA
                      </h2>
                      <p className="text-xs text-gray-500">
                        Ministry of Electronics & IT
                      </p>
                    </div>
                  </div>

                  {/* 2. Content Body */}
                  <div className="flex-1 flex flex-col justify-center space-y-6 px-8">
                    {/* Title */}
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-indigo-900 uppercase underline decoration-double underline-offset-4">
                        {viewingDoc.documentType || "Official Document"}
                      </h2>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-y-6 text-lg">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Name
                        </p>
                        <p className="font-bold text-gray-900 text-xl">
                          {currentUser.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Document ID
                        </p>
                        <p className="font-mono text-gray-900">
                          {viewingDoc._id.toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Date of Birth
                        </p>
                        {/* Random Mock Data for now */}
                        <p className="font-semibold text-gray-800">
                          22 / 03 / 2004
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Gender
                        </p>
                        <p className="font-semibold text-gray-800">Female</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Issued Date
                        </p>
                        <p className="font-semibold text-gray-800">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3. Footer / Verification Section */}
                  <div className="mt-8 flex justify-between items-end border-t border-gray-200 pt-6">
                    {/* DigiLocker Style Badge */}
                    <div className="bg-white border-2 border-indigo-600 rounded-lg p-2 flex items-center space-x-3 shadow-sm max-w-xs">
                      <div className="bg-indigo-600 p-2 rounded-full">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-indigo-800 uppercase">
                          SmartDoc Verified
                        </p>
                        <p className="text-[10px] text-gray-500 leading-tight">
                          Digitally signed & secured via Blockchain.
                        </p>
                      </div>
                    </div>

                    {/* QR Code Placeholder */}
                    <div className="flex flex-col items-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${viewingDoc._id}`}
                        alt="QR"
                        className="h-20 w-20 border p-1"
                        crossOrigin="anonymous"
                      />
                      <p className="text-[10px] text-gray-400 mt-1">
                        Scan to Verify
                      </p>
                    </div>

                    {/* Your Logo Watermark */}
                    <div className="flex flex-col items-end opacity-80">
                      <img
                        src={logoUrl}
                        alt="Logo"
                        className="h-12 object-contain mb-1"
                        crossOrigin="anonymous"
                      />
                      <p className="text-[10px] text-gray-400">
                        Generated by SmartDoc System
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
