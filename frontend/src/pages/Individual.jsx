// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom"; // Import useNavigate for redirects
// // FIX: Corrected import paths to use lowercase directory name and explicit .jsx extension
// import Sidebar from "../components/IndvidualComponents/Sidebar";
// import Header from "../components/IndvidualComponents/Header";
// import QuickActions from "../components/IndvidualComponents/QuickActions";
// import RecentDocuments from "../components/IndvidualComponents/RecentDocuments";
// import SearchDocuments from "../components/IndvidualComponents/SearchDocuments";
// import Settings from "../components/IndvidualComponents/Settings";
// import AvailableDocuments from "../components/IndvidualComponents/AvailableDocuments";

// // --- Loading state component ---
// const LoadingSpinner = () => (
//   <div className="flex justify-center items-center h-full">
//        {" "}
//     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
//      {" "}
//   </div>
// );

// // --- Error state component ---
// const ErrorMessage = ({ error }) => (
//   <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
//         <strong className="font-bold">Error! </strong>   {" "}
//     <span className="block sm:inline">
//             {error?.message || "Failed to load data"}   {" "}
//     </span>
//      {" "}
//   </div>
// );

// const Dashboard = () => {
//   const [selectedTab, setSelectedTab] = useState("home");
//   const [documents, setDocuments] = useState([]); // Set isLoading to true initially, it will be set to false after fetching profile and documents
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null); // --- Authentication State ---

//   const [currentUser, setCurrentUser] = useState(null);
//   const navigate = useNavigate(); // --- 1. Authentication Check Effect (Check localStorage for token) ---

//   useEffect(() => {
//     const userJson = localStorage.getItem("smartdoc_user");

//     if (!userJson) {
//       navigate("/login");
//       return;
//     }
//     try {
//       const user = JSON.parse(userJson); // Set basic token/id state, which triggers useEffect 2
//       setCurrentUser(user);
//     } catch (e) {
//       localStorage.removeItem("smartdoc_user");
//       navigate("/login");
//     } // Note: isLoading remains true until profile/data is fetched in useEffect 2
//   }, [navigate]); // --- 2. Data/Profile Fetching Effect (Fetch full profile from DB) ---

//   useEffect(() => {
//     // Only run if we have a user object (with a token) but haven't fetched the full name yet
//     if (!currentUser || currentUser.name) {
//       if (currentUser && currentUser.name) {
//         setIsLoading(false); // If profile is already populated, we are done loading
//       }
//       return;
//     }

//     const fetchUserProfileAndDocuments = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
//         const token = currentUser.token; // 1. FETCH USER PROFILE (FULL DETAILS)
//         // Assuming you have an endpoint that returns the user's full document (name, email, etc.)

//         const profileResponse = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/user/profile`,
//           { headers: { Authorization: `Bearer ${token}` } },
//         );
//         const profileData = profileResponse.data; // 2. FETCH USER DOCUMENTS

//         const docsResponse = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/myrequests`, // Using the correct API endpoint from your routes
//           { headers: { Authorization: `Bearer ${token}` } },
//         ); // 3. UPDATE STATE

//         setDocuments(docsResponse.data.requests || []); // Merge the new profile data with the existing token and update currentUser
//         setCurrentUser({ ...profileData, token: token });
//         setIsLoading(false);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError(err);
//         setIsLoading(false); // Handle token expiration/auth failure

//         if (err.response?.status === 401 || err.response?.status === 403) {
//           setError({
//             message: "Your session has expired. Please log in again.",
//           });
//           localStorage.removeItem("smartdoc_user");
//           setTimeout(() => navigate("/login"), 2000);
//         }
//       }
//     };

//     fetchUserProfileAndDocuments();
//   }, [currentUser, navigate]); // --- Logout Handler (to be passed to Sidebar) ---

//   const handleLogout = () => {
//     localStorage.removeItem("smartdoc_user");
//     navigate("/login");
//   }; // --- Render Logic ---
//   // Show a full-page spinner while we check for authentication and fetch profile

//   if (isLoading || !currentUser) {
//     return (
//       <div className="flex h-screen bg-gray-100 items-center justify-center">
//                 <LoadingSpinner />       {" "}
//         {/* Temporary fix for initial auth check */}     {" "}
//       </div>
//     );
//   } // User is authenticated and profile data is loaded

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {" "}
//       <Sidebar
//         selectedTab={selectedTab}
//         setSelectedTab={setSelectedTab}
//         handleLogout={handleLogout}
//       />{" "}
//       <main className="flex-1 overflow-y-auto bg-gray-100 p-8">
//         <Header user={currentUser} />       {" "}
//         {selectedTab === "home" && (
//           <>
//             <QuickActions />
//             <br />
//             <AvailableDocuments />
//             <br />           {" "}
//             {/* Show error if data fetching failed, otherwise show data/loading */}
//                        {" "}
//             {error ? (
//               <ErrorMessage error={error} />
//             ) : isLoading ? (
//               <LoadingSpinner />
//             ) : (
//               <RecentDocuments documents={documents} />
//             )}
//                      {" "}
//           </>
//         )}
//                {" "}
//         {selectedTab === "documents" &&
//           (error ? (
//             <ErrorMessage error={error} />
//           ) : (
//             <RecentDocuments documents={documents} />
//           ))}
//         {selectedTab === "search" && <SearchDocuments />}       {" "}
//         {selectedTab === "settings" && <Settings user={currentUser} />}
//          {" "}
//       </main>
//          {" "}
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirects
// Using the path specified by the user
import Sidebar from "../components/IndvidualComponents/Sidebar";
import Header from "../components/IndvidualComponents/Header";
import QuickActions from "../components/IndvidualComponents/QuickActions";
import RecentDocuments from "../components/IndvidualComponents/RecentDocuments";
import SearchDocuments from "../components/IndvidualComponents/SearchDocuments";
import Settings from "../components/IndvidualComponents/Settings";
import AvailableDocuments from "../components/IndvidualComponents/AvailableDocuments";

// --- Loading state component ---
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
       {" "}
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
     {" "}
  </div>
);

// --- Error state component ---
const ErrorMessage = ({ error }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error! </strong>   {" "}
    <span className="block sm:inline">
            {error?.message || "Failed to load data"}   {" "}
    </span>
     {" "}
  </div>
);

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("home");
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // --- Authentication State ---

  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate(); // --- 1. Authentication Check Effect (Check localStorage for token) ---

  useEffect(() => {
    const userJson = localStorage.getItem("smartdoc_user");

    if (!userJson) {
      navigate("/login");
      return;
    }
    try {
      const user = JSON.parse(userJson);
      setCurrentUser(user);
    } catch (e) {
      localStorage.removeItem("smartdoc_user");
      navigate("/login");
    }
  }, [navigate]); // --- 2. Data/Profile Fetching Effect (Fetch full profile from DB) ---

  useEffect(() => {
    // Only run if we have a user object (with a token) but haven't fetched the full name yet
    if (!currentUser || currentUser.name) {
      if (currentUser && currentUser.name) {
        setIsLoading(false);
      }
      return;
    }

    const fetchUserProfileAndDocuments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = currentUser.token; // 1. FETCH USER PROFILE (FULL DETAILS)

        const profileResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/profile`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const profileData = profileResponse.data; // 2. FETCH USER DOCUMENTS

        const docsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/myrequests`,
          { headers: { Authorization: `Bearer ${token}` } },
        ); // 3. UPDATE STATE

        setDocuments(docsResponse.data.requests || []);
        setCurrentUser({ ...profileData, token: token });
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
        setIsLoading(false);

        if (err.response?.status === 401 || err.response?.status === 403) {
          setError({
            message: "Your session has expired. Please log in again.",
          });
          localStorage.removeItem("smartdoc_user");
          setTimeout(() => navigate("/login"), 2000);
        }
      }
    };

    fetchUserProfileAndDocuments();
  }, [currentUser, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("smartdoc_user");
    navigate("/login");
  };

  if (isLoading || !currentUser) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
                <LoadingSpinner />     {" "}
      </div>
    );
  } // User is authenticated and profile data is loaded

  return (
    <div className="flex h-screen bg-gray-100">
      {" "}
      <Sidebar
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        handleLogout={handleLogout}
      />{" "}
      <main className="flex-1 overflow-y-auto bg-gray-100 p-8">
                <Header user={currentUser} />       {" "}
        {selectedTab === "home" && (
          <>
            <QuickActions />
            <br />
            <AvailableDocuments />
            <br />           {" "}
            {error ? (
              <ErrorMessage error={error} />
            ) : isLoading ? (
              <LoadingSpinner />
            ) : (
              <RecentDocuments documents={documents} />
            )}
                     {" "}
          </>
        )}
               {" "}
        {selectedTab === "documents" &&
          (error ? (
            <ErrorMessage error={error} />
          ) : (
            <RecentDocuments documents={documents} />
          ))}
                {selectedTab === "search" && <SearchDocuments />}       {" "}
        {selectedTab === "settings" && <Settings user={currentUser} />}   
         {" "}
      </main>
         {" "}
    </div>
  );
};

export default Dashboard;
