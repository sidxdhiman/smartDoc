import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/IndvidualComponents/Sidebar";
import Header from "../components/IndvidualComponents/Header";
import QuickActions from "../components/IndvidualComponents/QuickActions";
import RecentDocuments from "../components/IndvidualComponents/RecentDocuments";
import SearchDocuments from "../components/IndvidualComponents/SearchDocuments";
import Settings from "../components/IndvidualComponents/Settings";
import AvailableDocuments from "../components/IndvidualComponents/AvailableDocuments";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("home");
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch user from localStorage
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

  // ✅ Fetch profile & my requests
  const fetchData = async () => {
    if (!currentUser?.token) return;

    try {
      setIsLoading(true);
      setError(null);
      const token = currentUser.token;

      const profileResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const profileData = profileResponse.data;

      const docsResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/myrequests`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setDocuments(docsResponse.data.requests || []);
      setCurrentUser({ ...profileData, token });
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err);
      setIsLoading(false);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError({ message: "Session expired. Please log in again." });
        localStorage.removeItem("smartdoc_user");
        setTimeout(() => navigate("/login"), 2000);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser, navigate]);

  // ✅ NEW: Auto-refresh every 5 seconds to show latest verification status
  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // every 5 seconds
    return () => clearInterval(interval);
  }, [currentUser]);

  // ✅ NEW: Function to send a document request
  const handleSendRequest = async () => {
    try {
      const token = currentUser?.token;
      if (!token) return alert("You must be logged in!");

      const payload = {
        name: currentUser.name,
        phone: currentUser.phone || "9876543210",
        aadhaar: currentUser.aadhaar || "123412341234",
        documentType: "Marksheet",
        issuingAuthority: "University of Delhi",
        role: currentUser.role,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/requestdoc`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("✅ Request sent successfully!");
      console.log("Request response:", res.data);
      fetchData(); // Refresh after sending
    } catch (err) {
      console.error("❌ Error sending request:", err);
      alert("Failed to send request. Check console.");
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("smartdoc_user");
    navigate("/login");
  };

  if (isLoading || !currentUser)
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
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
      <main className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <Header user={currentUser} />

        {selectedTab === "home" && (
          <>
            <QuickActions />
            <br />
            <AvailableDocuments />
            <br />
            {/* ✅ New "Send Request" button */}
            <button
              onClick={handleSendRequest}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Send Document Request
            </button>
            <br />
            {error ? (
              <div className="text-red-600">{error.message}</div>
            ) : (
              <RecentDocuments documents={documents} />
            )}
          </>
        )}

        {selectedTab === "documents" && (
          <RecentDocuments documents={documents} />
        )}
        {selectedTab === "search" && <SearchDocuments />}
        {selectedTab === "settings" && <Settings user={currentUser} />}
      </main>
    </div>
  );
};

export default Dashboard;
