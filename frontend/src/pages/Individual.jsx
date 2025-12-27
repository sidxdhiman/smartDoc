import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/IndvidualComponents/Sidebar";
import Header from "../components/IndvidualComponents/Header";
import QuickActions from "../components/IndvidualComponents/QuickActions";
import RecentDocuments from "../components/IndvidualComponents/RecentDocuments"; // Uses the new component below
import SearchDocuments from "../components/IndvidualComponents/SearchDocuments";
import Settings from "../components/IndvidualComponents/Settings";
import AvailableDocuments from "../components/IndvidualComponents/AvailableDocuments";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("home");
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  // ✅ Store the selected file for upload
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();

  // 1. Initialize User
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

  // 2. Fetch Data (Profile + Documents)
  const fetchData = async () => {
    if (!currentUser?.token) return;

    try {
      setIsLoading(true);
      setError(null);
      const token = currentUser.token;

      // Fetch Requests
      const docsResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/request/myrequests`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setDocuments(docsResponse.data.requests || []);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err);
      setIsLoading(false);
    }
  };

  // 3. Trigger Fetch on Login
  useEffect(() => {
    if (currentUser?.token) {
      fetchData();
    }
  }, [currentUser?.token]);

  // 4. Handle File Input
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // 5. Send Request with File
  const handleSendRequest = async () => {
    try {
      const token = currentUser?.token;
      if (!token) return alert("Please login first.");
      if (!selectedFile) return alert("Please select a file to upload.");

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("name", currentUser.name);
      formData.append("phone", currentUser.phone || "9876543210");
      formData.append("aadhaar", currentUser.aadhaar || "123412341234");
      formData.append("documentType", "Marksheet"); 
      formData.append("issuingAuthority", "University of Delhi");
      formData.append("role", currentUser.role);

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/request/requestdoc`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Required for files
          },
        }
      );

      alert("✅ Request sent successfully!");
      setSelectedFile(null); // Clear input
      fetchData(); // Refresh list to show 'Pending' status
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload document.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("smartdoc_user");
    navigate("/login");
  };

  if (isLoading || !currentUser)
    return <div className="flex h-screen items-center justify-center">Loading...</div>;

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
            
            {/* Upload Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Upload Document</h3>
              <div className="flex gap-4 items-center">
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <button
                  onClick={handleSendRequest}
                  disabled={!selectedFile}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Request
                </button>
              </div>
              {selectedFile && <p className="mt-2 text-sm text-green-600">Selected: {selectedFile.name}</p>}
            </div>

            {/* Document List */}
            <RecentDocuments documents={documents} />
          </>
        )}

        {selectedTab === "documents" && <RecentDocuments documents={documents} />}
        {selectedTab === "search" && <SearchDocuments />}
        {selectedTab === "settings" && <Settings user={currentUser} />}
      </main>
    </div>
  );
};

export default Dashboard;