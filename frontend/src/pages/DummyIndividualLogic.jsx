import { useState, useEffect } from "react";
import {
  FileText,
  Search,
  HardDrive,
  Settings,
  Home,
  Plus,
  Bell,
  ExternalLink,
  User,
  LogOut,
  Upload,
  Filter,
  Layers,
  Info,
  Shield,
  Clock,
  X,
  CheckCircle,
} from "lucide-react";
import axios from "axios";

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [suggestedDocs, setSuggestedDocs] = useState([]);
  const [files, setFiles] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState("home");
  const [documentType, setDocumentType] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isDocumentRequestModalVisible, setIsDocumentRequestModalVisible] =
    useState(false);
  const [documentRequestStep, setDocumentRequestStep] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [documentRequestDetails, setDocumentRequestDetails] = useState({
    name: "",
    dob: "",
    rollNumber: "",
    aadhaarNumber: "",
  });
  const renderScreen = () => {
    switch (selectedTab) {
      case "home":
        return renderHomeScreen();
      case "documents":
        return renderDocumentsScreen();
      case "search":
        return renderSearchScreen();
      case "storage":
        return renderStorageScreen();
      case "settings":
        return renderSettingsScreen();
      default:
        return renderHomeScreen();
    }
  };

  const renderHomeScreen = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-8">
        {/* Quick Actions */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["Request Document", "Share Document"].map((action, index) => (
              <button
                key={index}
                className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
                onClick={() =>
                  action === "Request Document" 
                }
              >
                <Plus className="h-8 w-8 text-indigo-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  {action}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Documents */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Documents
          </h2>
          <div className="space-y-6">
            {suggestedDocs.map((doc, index) => (
              <div
                key={index}
                className="group flex items-start p-6 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <div className="flex-shrink-0">
                  <img
                    src={doc.icon}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow"
                  />
                </div>

                <div className="flex-1 ml-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {doc.title}
                    </h3>
                    {doc.status === "completed" && (
                      <span className="flex items-center px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verified
                      </span>
                    )}
                    {doc.status === "loading" && (
                      <span className="flex items-center px-3 py-1 bg-yellow-50 text-yellow-700 text-sm font-medium rounded-full">
                        <Clock className="h-4 w-4 mr-1" />
                        Processing
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-gray-600">{doc.description}</p>

                  {doc.status === "loading" && (
                    <div className="mt-4 space-y-3">
                      {doc.verificationStages.map((stage, stageIndex) => (
                        <div key={stageIndex} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{stage.name}</span>
                            <span className="text-gray-500">{`${
                              (stageIndex + 1) * 20
                            }%`}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                stage.completed
                                  ? "bg-green-500"
                                  : "bg-indigo-200 animate-pulse"
                              }`}
                              style={{ width: `${(stageIndex + 1) * 20}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {doc.status === "completed" && (
                    <div className="mt-4 flex flex-wrap items-center gap-6">
                      <div className="flex items-center">
                        <div className="flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
                          <span className="text-sm font-medium">
                            Blockchain Verified
                          </span>
                          <button
                            onClick={() =>
                              setSelectedVerificationModal("blockchain")
                            }
                            className="ml-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            <Info className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
                          <span className="text-sm font-medium">
                            AI Verified
                          </span>
                          <button
                            onClick={() => setSelectedVerificationModal("ai")}
                            className="ml-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            <Info className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <a
                        href={doc.documentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        View Document
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right Column */}
      <div className="space-y-8">
        {/* Document Categories */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Categories
          </h2>
          <div className="space-y-2">
            {["Personal", "Financial", "Educational", "Health", "Legal"].map(
              (category, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  <span className="font-medium text-gray-700">{category}</span>
                </button>
              )
            )}
          </div>
        </section>

        {/* Storage Usage */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Storage Usage
          </h2>
          <div className="mb-2">
            <div className="h-4 bg-gray-200 rounded-full">
              <div
                className="h-4 bg-indigo-600 rounded-full"
                style={{ width: "65%" }}
              ></div>
            </div>
          </div>
          <p className="text-sm text-gray-600">3.25 GB of 5 GB used</p>
        </section>
      </div>
    </div>
  );

  const renderDocumentsScreen = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Documents</h2>
        <button
          onClick={() => setIsVisible(true)}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Upload className="mr-2 h-5 w-5" /> Upload New
        </button>
      </div>

      {/* Document Filters */}
      <div className="flex space-x-4 mb-6">
        {["All", "Personal", "Financial", "Educational", "Legal"].map(
          (filter) => (
            <button
              key={filter}
              className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-indigo-100"
            >
              <Filter className="mr-2 h-4 w-4" /> {filter}
            </button>
          )
        )}
      </div>

      {/* Document List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyDataArray.map((doc, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <img
                src={doc.logo}
                alt={doc.title}
                className="w-12 h-12 mr-4 rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                <p className="text-sm text-gray-600">{doc.documentType}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              {doc.description.slice(0, 100)}...
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                {doc.governmentType}
              </span>
              <button className="text-indigo-600 hover:text-indigo-800">
                <ExternalLink className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSearchScreen = () => (
    <div className="space-y-6">
      <div className="relative mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents by name, type, or description..."
          className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {/* Search Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((doc, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow"
            onClick={() => handleDocumentRequestFlow(doc)}
          >
            <div className="flex items-center mb-4">
              <img
                src={doc.logo}
                alt={doc.title}
                className="w-12 h-12 mr-4 rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                <p className="text-sm text-gray-600">{doc.documentType}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              {doc.description.slice(0, 100)}...
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                {doc.governmentType}
              </span>
              <button className="text-indigo-600 hover:text-indigo-800">
                <ExternalLink className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocumentRequestModal = () => {
    if (!isDocumentRequestModalVisible) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl">
          {/* Header Section */}
          <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Document Request Portal
              </h2>
              <p className="text-gray-600 mt-1">
                Dronacharya College ID Card Request System
              </p>
            </div>
            <button
              onClick={() => {
                setIsDocumentRequestModalVisible(false);
                setDocumentRequestStep(null);
                setSelectedUserType(null);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User Type Selection */}
          {documentRequestStep === "userType" && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Select User Type
                </h3>
                <p className="text-gray-600">
                  Please choose your role in the institution
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setSelectedUserType("student");
                    setDocumentRequestStep("documentType");
                  }}
                  className="flex flex-col items-center p-6 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors border-2 border-indigo-100"
                >
                  <span className="text-lg font-semibold">Student</span>
                  <span className="text-sm text-indigo-600 mt-1">
                    Currently enrolled
                  </span>
                </button>
                <button
                  onClick={() => {
                    setSelectedUserType("teacher");
                    setDocumentRequestStep("documentType");
                  }}
                  className="flex flex-col items-center p-6 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors border-2 border-indigo-100"
                >
                  <span className="text-lg font-semibold">Teacher</span>
                  <span className="text-sm text-indigo-600 mt-1">
                    Faculty member
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Document Type Selection */}
          {documentRequestStep === "documentType" && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Select Document Type
                </h3>
                <p className="text-gray-600">
                  Choose the document you need to request
                </p>
              </div>
              <button
                onClick={() => setDocumentRequestStep("details")}
                className="w-full flex items-center justify-between p-6 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors border-2 border-indigo-100"
              >
                <div className="flex flex-col items-start">
                  <span className="text-lg font-semibold">ID Card</span>
                  <span className="text-sm text-indigo-600 mt-1">
                    Official college identification
                  </span>
                </div>
                <span className="text-indigo-600">→</span>
              </button>
            </div>
          )}

          {/* Details Form */}
          {documentRequestStep === "details" && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Personal Information
                </h3>
                <p className="text-gray-600">
                  Please fill in your details accurately
                </p>
              </div>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={documentRequestDetails.name}
                    onChange={(e) =>
                      setDocumentRequestDetails({
                        ...documentRequestDetails,
                        name: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={documentRequestDetails.dob}
                    onChange={(e) =>
                      setDocumentRequestDetails({
                        ...documentRequestDetails,
                        dob: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {selectedUserType === "student"
                      ? "Roll Number"
                      : "Employee ID"}
                  </label>
                  <input
                    type="text"
                    placeholder={`Enter your ${
                      selectedUserType === "student"
                        ? "roll number"
                        : "employee ID"
                    }`}
                    value={documentRequestDetails.rollNumber}
                    onChange={(e) =>
                      setDocumentRequestDetails({
                        ...documentRequestDetails,
                        rollNumber: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your 12-digit Aadhaar number"
                    value={documentRequestDetails.aadhaarNumber}
                    onChange={(e) =>
                      setDocumentRequestDetails({
                        ...documentRequestDetails,
                        aadhaarNumber: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
                <button
                  onClick={startDocumentRequest}
                  className="w-full bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 font-medium transition-colors mt-4"
                >
                  Submit Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStorageScreen = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Storage Management
      </h2>

      {/* Storage Overview */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Storage Usage</h3>
          <Layers className="h-6 w-6 text-indigo-600" />
        </div>
        <div className="mb-4">
          <div className="h-6 bg-gray-200 rounded-full">
            <div
              className="h-6 bg-indigo-600 rounded-full"
              style={{ width: "65%" }}
            ></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-gray-600">Total</p>
            <p className="font-bold">5 GB</p>
          </div>
          <div>
            <p className="text-gray-600">Used</p>
            <p className="font-bold text-indigo-600">3.25 GB</p>
          </div>
          <div>
            <p className="text-gray-600">Free</p>
            <p className="font-bold text-green-600">1.75 GB</p>
          </div>
        </div>
      </div>

      {/* File Type Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4">Storage by Document Type</h3>
        <div className="space-y-3">
          {[
            { type: "PDFs", size: "1.5 GB", percent: "45%" },
            { type: "Images", size: "750 MB", percent: "22%" },
            { type: "Spreadsheets", size: "500 MB", percent: "15%" },
            { type: "Others", size: "500 MB", percent: "15%" },
          ].map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-4 mr-4">
                <div
                  className="bg-indigo-600 h-4 rounded-full"
                  style={{ width: item.percent }}
                ></div>
              </div>
              <div className="flex-shrink-0">
                <span className="text-sm text-gray-600">
                  {item.type} - {item.size}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettingsScreen = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Account Settings
      </h2>

      {/* Profile Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center mb-6">
          <img
            src="/api/placeholder/100/100"
            alt="Profile"
            className="w-24 h-24 rounded-full mr-6 border-4 border-indigo-100"
          />
          <div>
            <h3 className="text-xl font-semibold">Raghav sharma</h3>
            <p className="text-gray-600">Raghav.sharma@example.com</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center bg-indigo-50 text-indigo-700 p-3 rounded-lg hover:bg-indigo-100">
            <User className="mr-2 h-5 w-5" /> Edit Profile
          </button>
          <button className="flex items-center justify-center bg-indigo-50 text-indigo-700 p-3 rounded-lg hover:bg-indigo-100">
            <Shield className="mr-2 h-5 w-5" /> Privacy Settings
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4">Security</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">
                Add an extra layer of security
              </p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                name="toggle"
                id="twoFactor"
                className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="twoFactor"
                className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              ></label>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Login Notifications</h4>
              <p className="text-sm text-gray-600">
                Get alerts for newdevice logins
              </p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                name="toggle"
                id="loginNotify"
                className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="loginNotify"
                className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              ></label>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            {
              title: "Email Notifications",
              description: "Receive updates and alerts via email",
              icon: <Bell className="h-5 w-5 text-indigo-600 mr-3" />,
            },
            {
              title: "SMS Alerts",
              description: "Get important notifications as text messages",
              icon: <Clock className="h-5 w-5 text-green-600 mr-3" />,
            },
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center">
                {item.icon}
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  name={`notify-${index}`}
                  id={`notify-${index}`}
                  className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor={`notify-${index}`}
                  className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-red-100">
        <h3 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-red-700">Delete Account</h4>
              <p className="text-sm text-gray-600">
                Permanently remove your account and all data
              </p>
            </div>
            <button
              onClick={localStorage.removeItem("finishedDocument")}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const handleSubmitDocumentRequest = () => {
    // Close modal
    setIsDocumentRequestModalVisible(false);

    // Add a new document to suggestedDocs with a loading state
    suggestedDocs.push({
      title: "Raghav ID Card",
      description: "Processing your ID Card request...",
      icon: "/api/placeholder/100/100", // Placeholder icon
      status: "loading",
    });

    // Reset modal states
    setDocumentRequestStep(null);
    setSelectedUserType(null);
    setDocumentRequestDetails({
      name: "",
      dob: "",
      rollNumber: "",
      aadhaarNumber: "",
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles([...selectedFiles]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });
    formData.append("title", documentTitle);
    formData.append("description", documentDescription);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        console.log("Files uploaded successfully");
        setIsVisible(false);
        fetchDocuments();
      } else {
        console.error("Failed to upload files");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/documents/all`
      );
      const data = await response.json();
      if (data.documents) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const getIpfsLink = (ipfsHash) => {
    return `https://ipfs.io/ipfs/${ipfsHash}`;
  };

  const dummyDataArray = [
    {
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaIwihIMPW6RVGSU5u1_mEtOPCfsqfzA1RUQ&s",
      title: "Dronacharya College of Engineering",
      description: "Official ID Card Issuance for Students and Teachers",
      governmentType: "Educational Institution",
      documentType: "ID Card",
    },
    {
      logo: "https://cdn.iconscout.com/icon/free/png-512/free-aadhaar-logo-icon-download-in-svg-png-gif-file-formats--unique-identity-india-citizen-information-details-logos-icons-1747945.png?f=webp&w=512",
      title: "Unique Identification Authority of India (UIDAI)",
      description: "Aadhar Card is issued by UIDAI, Government of India",
      governmentType: "Central Government",
      documentType: "Aadhar Card",
    },
    {
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXIHCJJ2QTxfumQq23zNyWNqWX4nbz4elmSw&s",
      title: "Gurugram University, Gurugram",
      description:
        "Gurugram University, Gurugram is issuing their Digital awards for the following years,through SmartDoc",
      governmentType: "State Government",
      documentType: "Degree Certificate",
    },
    {
      logo: "https://we-recycle.org/wp-content/uploads/2014/03/bses-rajdhani.png",
      title: "BSES YAMUNA/ RAJDHANI POWER LTD",
      description:
        "BSES YAMUNA/ RAJDHANI POWER LTD is issuing their Digital awards for the following years,through SmartDoc",
      governmentType: "State Government",
      documentType: "Electricity Bill",
    },
  ];

  const filteredData = dummyDataArray.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDocumentClick = (doc) => {
    setSelectedDocument(doc);
  };

  const handleDocumentRequestFlow = (doc) => {
    if (doc.title === "Dronacharya College of Engineering") {
      setIsDocumentRequestModalVisible(true);
      setDocumentRequestStep("userType");
    }
  };

  const [selectedVerificationModal, setSelectedVerificationModal] =
    useState(null);

  // Verification Modal Component
  const VerificationModal = ({ type, onClose }) => {
    const modalContent = {
      blockchain: {
        title: "Blockchain Verification",
        description: "Digital Certificate registered and verified",
      },
      ai: {
        title: "AI Verification",
        description:
          "Document's information has been matched successfully by official government records",
      },
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {modalContent[type].title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-gray-600">{modalContent[type].description}</p>
        </div>
      </div>
    );
  };

  const startDocumentRequest = () => {
    const newDoc = {
      title: "Raghav ID Card",
      description: "Processing your ID Card request...",
      icon: "https://dial4college.blr1.cdn.digitaloceanspaces.com/pro/205/logo/1695981052.PNG",
      status: "loading",
      verificationStages: [
        { name: "Document Requested", completed: false },
        { name: "Document Issued", completed: false },
        { name: "Digital Certificate Verified", completed: false },
        { name: "AI Verified", completed: false },
        { name: "Verified", completed: false },
      ],
      blockchainVerification: false,
      aiVerification: false,
      documentLink:
        "https://ipfs.io/ipfs/QmYAHYrQaxYMZNQ4DsWBWHoPAQD8tL7SaTvu7BhSBbMUog",
    };

    // Add the new document to suggestedDocs
    setSuggestedDocs((prev) => [...prev, newDoc]);

    // Simulate loading stages
    let currentStage = 0;
    const loadingInterval = setInterval(() => {
      setSuggestedDocs((prev) =>
        prev.map((doc) => {
          if (doc.title === "Raghav ID Card") {
            const updatedStages = Array.isArray(doc.verificationStages)
              ? [...doc.verificationStages]
              : [];

            if (currentStage < updatedStages.length) {
              updatedStages[currentStage].completed = true;

              if (currentStage === 3) {
                doc.blockchainVerification = true;
                doc.aiVerification = true;
              }

              if (currentStage === 4) {
                doc.status = "completed";
                doc.description =
                  "Issued by Dronacharya College of Engineering";
              }
              localStorage.setItem(
                "finishedDocument",
                JSON.stringify({ ...doc, verificationStages: updatedStages })
              );

              return { ...doc, verificationStages: updatedStages };
            }
          }
          return doc;
        })
      );

      currentStage++;
      if (currentStage >= 5) {
        clearInterval(loadingInterval);
      }
    }, 6000);
    setIsDocumentRequestModalVisible(false);
    // 6 seconds per stage
  };

  const getFinishedDocument = () => {
    const finishedDoc = localStorage.getItem("finishedDocument");
    return finishedDoc ? JSON.parse(finishedDoc) : null;
  };

  useEffect(() => {
    const finishedDoc = getFinishedDocument();
    if (finishedDoc) {
      setSuggestedDocs((prev) => [...prev, finishedDoc]);
    }
  }, []);

  const navigation = [
    { name: "Home", icon: Home, tab: "home" },
    { name: "Documents", icon: FileText, tab: "documents" },
    { name: "Search", icon: Search, tab: "search" },
    { name: "Storage", icon: HardDrive, tab: "storage" },
    { name: "Settings", icon: Settings, tab: "settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}

      <aside className="w-64 bg-indigo-700 text-white shadow-xl">
        <div className="h-full flex flex-col py-8">
          {/* Logo Section */}
          <div className="px-6 mb-10">
            <div className="flex items-center justify-center space-x-3">
              <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <img src="/icon.png" className="w-10 h-10 rounded-md"/>
              </div>
              <span className="text-2xl font-bold tracking-tight">
                SmartDoc
              </span>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 px-4">
            <div className="space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setSelectedTab(item.tab)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    selectedTab === item.tab
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-indigo-100 hover:bg-indigo-600/50 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="px-4 mt-6 space-y-1">
            <div className="h-px bg-indigo-600/50 my-4" />
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-indigo-100 hover:bg-indigo-600/50 hover:text-white">
              <User className="h-5 w-5" />
              <span className="font-medium">Profile</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-indigo-100 hover:bg-indigo-600/50 hover:text-white">
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-100">
        <div className="p-8">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, Raghav
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your digital documents securely
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow">
                <Bell className="h-5 w-5 text-indigo-600" />
              </button>
              <img
                src=""
                alt="Profile"
                className="h-10 w-10 rounded-full border-2 border-indigo-500"
              />
            </div>
          </header>
          {renderScreen()}
          {/* Content */}
        </div>
      </main>

      {/* Modal for adding new document */}
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Upload New Document
              </h3>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4"
            >
              <p className="text-gray-600 mb-2">Drag & Drop your files here</p>
              <p className="text-gray-400 mb-4">or</p>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            <input
              type="text"
              placeholder="Document Type"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Document Title"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              placeholder="Document Description"
              value={documentDescription}
              onChange={(e) => setDocumentDescription(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
            <button
              onClick={handleUpload}
              className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold hover:bg-indigo-700 transition-colors"
            >
              Upload Document
            </button>
          </div>
        </div>
      )}
      {renderDocumentRequestModal()}
      {selectedVerificationModal && (
        <VerificationModal
          type={selectedVerificationModal}
          onClose={() => setSelectedVerificationModal(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
