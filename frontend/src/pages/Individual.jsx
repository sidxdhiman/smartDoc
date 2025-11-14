import React, { useState, useEffect } from "react";
import axios from "axios"; // Make sure to install axios: npm install axios
import Sidebar from "../components/IndvidualComponents/Sidebar";
import Header from "../components/IndvidualComponents/Header";
import QuickActions from "../components/IndvidualComponents/QuickActions";
import RecentDocuments from "../components/IndvidualComponents/RecentDocuments";
import SearchDocuments from "../components/IndvidualComponents/SearchDocuments";
import Settings from "@/components/IndvidualComponents/Settings";
import AvailableDocuments from "@/components/IndvidualComponents/AvailableDocuments";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("home");
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/getVerificationReq`,
          {
            headers: {
              // Add any necessary authentication headers
              // 'Authorization': `Bearer ${yourAuthToken}`
            },
          }
        );

        // Assuming the response structure matches the previous example
        setDocuments(response.data.requests || []);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError(err);
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []); // Empty dependency array means this runs once on component mount

  // Loading state component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
    </div>
  );

  // Error state component
  const ErrorMessage = () => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <strong className="font-bold">Error! </strong>
      <span className="block sm:inline">
        {error?.message || "Failed to load documents"}
      </span>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <main className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <Header />
        {selectedTab === "home" && (
          <>
            <QuickActions />
            <br />
            <AvailableDocuments />
            <br />
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorMessage />
            ) : (
              <RecentDocuments documents={documents} />
            )}
          </>
        )}
        {selectedTab === "documents" && (
          <RecentDocuments documents={documents} />
        )}
        {selectedTab === "search" && <SearchDocuments />}
        {selectedTab === "settings" && <Settings />}
      </main>
    </div>
  );
};

export default Dashboard;
