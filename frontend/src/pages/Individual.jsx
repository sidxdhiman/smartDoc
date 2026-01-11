import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";

import Sidebar from "../components/IndvidualComponents/Sidebar";
import Header from "../components/IndvidualComponents/Header";
import QuickActions from "../components/IndvidualComponents/QuickActions";
import RecentDocuments from "../components/IndvidualComponents/RecentDocuments";
import AvailableDocuments from "../components/IndvidualComponents/AvailableDocuments";

// ✅ Import Assets
import logoUrl from "../../assets/logo.png";
const emblemUrl =
  "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg";

// ✅ Security Background Pattern (Guilloche effect via CSS)
const securityPatternStyle = {
  backgroundImage: `
    radial-gradient(circle, transparent 20%, #ffffff 20%, #ffffff 80%, transparent 80%, transparent),
    radial-gradient(circle, transparent 20%, #ffffff 20%, #ffffff 80%, transparent 80%, transparent)
  `,
  backgroundSize: "30px 30px",
  backgroundColor: "#fcfbf7", // Parchment color
  opacity: 1,
};

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("home");
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);
  const certificateRef = useRef(null);
  const navigate = useNavigate();

  // 1. Fetch User & Data Logic
  useEffect(() => {
    const userJson = localStorage.getItem("smartdoc_user");
    if (!userJson) {
      navigate("/login");
      return;
    }
    try {
      setCurrentUser(JSON.parse(userJson));
    } catch {
      localStorage.removeItem("smartdoc_user");
      navigate("/login");
    }
  }, [navigate]);

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

  useEffect(() => {
    if (currentUser?.token) fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.token]);

  // Background Refresh
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

  const handleLogout = () => {
    localStorage.removeItem("smartdoc_user");
    navigate("/login");
  };

  const isVerified = (status) => {
    if (!status) return false;
    return ["VERIFIED", "ISSUED"].includes(status.toUpperCase());
  };

  // ✅ ENHANCED DOWNLOAD FUNCTION
  const handleDownloadImage = async () => {
    if (certificateRef.current) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for render
        const canvas = await html2canvas(certificateRef.current, {
          useCORS: true,
          scale: 3, // High Resolution
          backgroundColor: "#fcfbf7",
          logging: false,
        });
        const link = document.createElement("a");
        link.download = `SmartDoc_${viewingDoc.documentType || "Certificate"}.png`;
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
      } catch (err) {
        console.error("Failed to generate image", err);
        alert("Could not generate image. Please try again.");
      }
    }
  };

  if (isLoading || !currentUser)
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );

  return (
    <div className="flex h-screen bg-muted/20 font-sans text-foreground">
      <Sidebar
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        handleLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto p-8 relative">
        <Header user={currentUser} />

        {selectedTab === "home" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <QuickActions />
            <AvailableDocuments />
            {error ? (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
                {error.message}
              </div>
            ) : (
              <RecentDocuments documents={documents} />
            )}
          </div>
        )}

        {selectedTab === "documents" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-bold tracking-tight mb-6">
              Issued Documents
            </h3>
            {documents.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-xl border border-border shadow-sm">
                <p className="text-muted-foreground text-lg">
                  No documents found.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc) => {
                  const verified = isVerified(doc.status);
                  return (
                    <div
                      key={doc._id}
                      className="bg-card text-card-foreground rounded-xl shadow-sm hover:shadow-md transition-all border border-border overflow-hidden group"
                    >
                      <div className="p-5 flex items-start space-x-4">
                        <div
                          className={`p-3 rounded-xl ${verified ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"}`}
                        >
                          <svg
                            className="w-6 h-6"
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
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-lg truncate">
                            {doc.documentType || "Document"}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1 font-mono">
                            ID: {doc._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div className="px-5 pb-4">
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${verified ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:border-green-800" : "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"}`}
                        >
                          {verified
                            ? "✓ Verified on Blockchain"
                            : "⚠ Pending Verification"}
                        </div>
                      </div>

                      <div className="p-4 bg-muted/30 border-t border-border group-hover:bg-primary/5 transition-colors">
                        <button
                          disabled={!verified}
                          onClick={() => setViewingDoc(doc)}
                          className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                            verified
                              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                              : "bg-muted text-muted-foreground cursor-not-allowed"
                          }`}
                        >
                          {verified
                            ? "View Digital Certificate"
                            : "Processing Request..."}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =====================================================================================
            ✅ PRODUCTION GRADE CERTIFICATE MODAL
           ===================================================================================== */}
        {viewingDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-6xl h-[95vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-border animate-in zoom-in-95 duration-300">
              {/* Modal Toolbar */}
              <div className="bg-primary text-primary-foreground px-6 py-4 flex justify-between items-center z-10 shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-1.5 h-6 bg-white/30 rounded-full"></div>
                  <h2 className="text-lg font-semibold tracking-wide">
                    Digital Document Viewer
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleDownloadImage}
                    className="group bg-white/10 hover:bg-white/20 px-5 py-2 rounded-lg text-sm font-medium flex items-center transition-all border border-white/10"
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
                    Download PDF / Image
                  </button>
                  <button
                    onClick={() => setViewingDoc(null)}
                    className="text-white/70 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Scrollable Viewport */}
              <div className="flex-1 bg-muted/50 overflow-y-auto p-8 flex justify-center items-start">
                {/* --------------------------------------------------
                   THE CERTIFICATE CANVAS
                   --------------------------------------------------
                */}
                <div
                  ref={certificateRef}
                  className="relative text-gray-900 shadow-2xl flex flex-col"
                  style={{
                    width: "850px",
                    minHeight: "600px",
                    backgroundColor: "#fcfbf7",
                    fontFamily: "'Times New Roman', serif",
                  }}
                >
                  {/* Security Background Pattern */}
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={securityPatternStyle}
                  ></div>

                  {/* Decorative Border */}
                  <div className="absolute inset-3 border-4 border-double border-[#C5A059] z-10 pointer-events-none"></div>
                  <div className="absolute inset-5 border border-[#C5A059] opacity-50 z-10 pointer-events-none"></div>

                  {/* Corner Ornaments */}
                  <div className="absolute top-5 left-5 w-16 h-16 border-t-4 border-l-4 border-[#C5A059] z-20"></div>
                  <div className="absolute top-5 right-5 w-16 h-16 border-t-4 border-r-4 border-[#C5A059] z-20"></div>
                  <div className="absolute bottom-5 left-5 w-16 h-16 border-b-4 border-l-4 border-[#C5A059] z-20"></div>
                  <div className="absolute bottom-5 right-5 w-16 h-16 border-b-4 border-r-4 border-[#C5A059] z-20"></div>

                  {/* LARGE CENTER WATERMARK */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                    <img
                      src={emblemUrl}
                      className="w-[400px] h-[400px] opacity-[0.04] grayscale"
                      alt=""
                      crossOrigin="anonymous"
                    />
                  </div>

                  {/* CONTENT START */}
                  <div className="relative z-30 flex-1 flex flex-col p-12">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-10 border-b border-[#C5A059]/30 pb-6">
                      <div className="flex flex-col items-center">
                        <img
                          src={emblemUrl}
                          alt="Emblem"
                          className="h-20 object-contain mb-2"
                          crossOrigin="anonymous"
                        />
                        <span className="text-[10px] font-bold tracking-[0.2em] text-gray-600 uppercase">
                          Government of India
                        </span>
                        <span className="text-[8px] tracking-wider text-gray-500 uppercase">
                          Ministry of Electronics & IT
                        </span>
                      </div>

                      <div className="flex-1 text-center px-4 pt-2">
                        <h1
                          className="text-4xl font-black text-[#1a202c] uppercase tracking-wide"
                          style={{ textShadow: "1px 1px 0px rgba(0,0,0,0.1)" }}
                        >
                          Certificate of Issuance
                        </h1>
                        <p className="text-[#C5A059] font-bold tracking-widest uppercase text-xs mt-2">
                          — Officially Digital Verified Document —
                        </p>
                      </div>

                      <div className="flex flex-col items-end opacity-90">
                        <img
                          src={logoUrl}
                          alt="SmartDoc"
                          className="h-12 object-contain mb-1"
                          crossOrigin="anonymous"
                        />
                        <div className="bg-indigo-900 text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                          SmartDoc
                        </div>
                      </div>
                    </div>

                    {/* Main Document Body */}
                    <div className="flex-1 px-8 text-center space-y-6">
                      <p className="text-gray-500 text-sm uppercase tracking-widest italic font-serif">
                        This is to certify that the document described below
                      </p>

                      <div className="py-2">
                        <h2 className="text-3xl font-bold text-indigo-950 uppercase border-b-2 border-indigo-900/10 inline-block pb-2 px-8">
                          {viewingDoc.documentType || "Official Document"}
                        </h2>
                      </div>

                      <div className="text-lg text-gray-600 italic">
                        Has been securely issued to
                      </div>

                      <div className="text-4xl font-bold text-gray-900 capitalize font-serif">
                        {currentUser.name}
                      </div>

                      {/* Detailed Grid */}
                      <div className="mt-8 bg-[#fffdf5] border border-[#C5A059]/20 p-6 rounded-sm shadow-inner mx-auto max-w-2xl">
                        <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-left">
                          <div className="border-l-2 border-[#C5A059] pl-3">
                            <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-sans font-bold">
                              Document ID
                            </span>
                            <span className="block text-lg font-mono text-gray-800 break-all leading-tight">
                              {viewingDoc._id}
                            </span>
                          </div>

                          <div className="border-l-2 border-[#C5A059] pl-3">
                            <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-sans font-bold">
                              Date of Issue
                            </span>
                            <span className="block text-lg font-serif text-gray-800">
                              {new Date().toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>

                          <div className="border-l-2 border-[#C5A059] pl-3">
                            <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-sans font-bold">
                              Status
                            </span>
                            <span className="block text-lg font-serif text-green-700 font-bold flex items-center">
                              Verified <span className="ml-1 text-base">✓</span>
                            </span>
                          </div>

                          <div className="border-l-2 border-[#C5A059] pl-3">
                            <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-sans font-bold">
                              Issuer Authority
                            </span>
                            <span className="block text-lg font-serif text-gray-800">
                              Govt. Digital Registry
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer / Auth Marks */}
                    <div className="mt-12 pt-6 border-t border-[#C5A059]/30 flex justify-between items-end">
                      {/* Left: QR Code */}
                      <div className="flex items-center space-x-3">
                        <div className="bg-white p-1 border border-gray-200 shadow-sm">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SMARTDOC:${viewingDoc._id}`}
                            alt="QR"
                            className="h-20 w-20"
                            crossOrigin="anonymous"
                          />
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] uppercase font-bold text-gray-400">
                            Scan to Verify
                          </p>
                          <p className="text-[9px] text-gray-400 max-w-[120px] leading-tight">
                            Authenticity can be verified via SmartDoc Blockchain
                            Ledger.
                          </p>
                        </div>
                      </div>

                      {/* Center: Badge */}
                      <div className="text-center pb-2">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#C5A059] bg-[#C5A059]/10 mb-1">
                          <svg
                            className="w-8 h-8 text-[#C5A059]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-[10px] font-bold text-[#b08d55] uppercase tracking-widest">
                          Digitally Signed
                        </p>
                      </div>

                      {/* Right: Signature Placeholder */}
                      <div className="text-right">
                        <div className="h-10 flex items-end justify-end">
                          <span
                            className="text-3xl text-indigo-900 pr-2"
                            style={{ fontFamily: "cursive" }}
                          >
                            SmartDoc_Admin
                          </span>
                        </div>
                        <div className="border-t border-gray-400 w-40 mt-1"></div>
                        <p className="text-[10px] font-bold uppercase text-gray-500 mt-1">
                          Authorized Signatory
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* END CERTIFICATE */}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
