import React, { useState, useEffect } from "react";
import {
  FileText,
  Bell,
  Home,
  BarChart2,
  Users,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import VerifiedDocumentsPage from "./VerifierComponents/VerifiedDocumentsPage";
import AnalyticsPage from "./VerifierComponents/AnalyticsPage";
import UsersPage from "./VerifierComponents/UsersPage";
import AIInsightsPage from "./VerifierComponents/AllInsightsPage";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// --- API Calls ---
const verifyDocument = async (requestId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/verifydoc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requestId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Verification failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error verifying document:", error);
    throw error;
  }
};

const getVerificationRequests = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/getVerificationReq`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch verification requests");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching verification requests:", error);
    throw error;
  }
};

const DashboardPage = ({ verificationData, onVerify }) => {
  const requests = verificationData?.requests || [];
  const totalDocs = requests.length;
  const verifiedDocs = requests.filter((r) => r.status === "verified").length;
  const pendingDocs = requests.filter(
    (r) => !r.status || r.status === "Issued",
  ).length;
  const rejectedDocs = requests.filter((r) => r.status === "rejected").length;

  const verifiedPercentage = totalDocs ? (verifiedDocs / totalDocs) * 100 : 0;
  const pendingPercentage = totalDocs ? (pendingDocs / totalDocs) * 100 : 0;
  const rejectedPercentage = totalDocs ? (rejectedDocs / totalDocs) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Welcome to SmartDoc Verification
          </CardTitle>
          <CardDescription>
            Your AI-powered document verification platform for Bharat Cert
            Organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Documents
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDocs}</div>
                <p className="text-xs text-muted-foreground">
                  Total documents in system
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{verifiedDocs}</div>
                <p className="text-xs text-muted-foreground">
                  {verifiedPercentage.toFixed(1)}% of total documents
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingDocs}</div>
                <p className="text-xs text-muted-foreground">
                  {pendingPercentage.toFixed(1)}% of total documents
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{rejectedDocs}</div>
                <p className="text-xs text-muted-foreground">
                  {rejectedPercentage.toFixed(1)}% of total documents
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Verification Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Verified</span>
                </div>
                <span className="font-bold">
                  {(totalDocs / totalDocs) * 100}%
                </span>
              </div>
              <Progress value={(totalDocs / totalDocs) * 100} className="h-2" />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span>Pending</span>
                </div>
                <span className="font-bold">
                  {pendingPercentage.toFixed(1)}%
                </span>
              </div>
              <Progress value={pendingPercentage} className="h-2" />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>Rejected</span>
                </div>
                <span className="font-bold">
                  {rejectedPercentage.toFixed(1)}%
                </span>
              </div>
              <Progress value={rejectedPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* ✅ Updated Recent Activity Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {requests.map((request, index) => (
                  <div
                    key={index}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      if (typeof onRequestClick === "function") {
                        onRequestClick(request);
                      } else if (typeof onVerify === "function") {
                        onVerify(request._id);
                      } else {
                        console.log("Clicked request:", request);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (typeof onRequestClick === "function") {
                          onRequestClick(request);
                        } else if (typeof onVerify === "function") {
                          onVerify(request._id);
                        } else {
                          console.log("Clicked request:", request);
                        }
                      }
                    }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <div className="flex items-center space-x-3">
                      {request.status === "verified" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : request.status === "rejected" ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {request.documentType}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {request.name}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {new Date(request.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant={
                        request.status === "verified"
                          ? "success"
                          : request.status === "rejected"
                            ? "destructive"
                            : "warning"
                      }
                      className="ml-auto"
                    >
                      {request.status || "pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Pending Verifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingDocs > 0 ? (
            <div className="space-y-4">
              {requests
                .filter(
                  (request) => !request.status || request.status === "Issued",
                )
                .map((request, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{request.documentType}</p>
                      <p className="text-sm text-muted-foreground">
                        {request.name}
                      </p>
                    </div>
                    <Button
                      onClick={() => onVerify(request._id)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Verify
                    </Button>
                  </div>
                ))}
            </div>
          ) : (
            <div className="rounded-md flex flex-row gap-2">
              No pending Verifications, auto verify is ON{" "}
              <CheckCircle className="text-green-700" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const VerificationPage = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVerificationRequests = async () => {
    try {
      setLoading(true);
      const data = await getVerificationRequests();
      setVerificationData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  const handleVerifyDocument = async (requestId) => {
    try {
      await verifyDocument(requestId);
      await fetchVerificationRequests();
    } catch (err) {
      setError(err.message);
    }
  };

  const renderCurrentView = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">Loading...</div>
      );
    }

    if (error) {
      return <div className="text-red-500">Error: {error}</div>;
    }

    switch (activeView) {
      case "verified-documents":
        return <VerifiedDocumentsPage verificationData={verificationData} />;
      case "users":
        return <UsersPage />;
      case "analytics":
        return <AnalyticsPage verificationData={verificationData} />;
      case "ai-insights":
        return <AIInsightsPage />;
      default:
        return (
          <DashboardPage
            verificationData={verificationData}
            onVerify={handleVerifyDocument}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="hidden w-64 bg-indigo-700 text-white lg:block">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-center space-x-3">
            <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg my-5">
              <img
                src="/icon.png"
                className="w-10 h-10 rounded-md"
                alt="SmartDoc Logo"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight">SmartDoc</span>
          </div>
          <ScrollArea className="flex-1 px-3">
            <nav className="space-y-2">
              {[
                { name: "Dashboard", icon: Home },
                { name: "Verified Documents", icon: FileText },
                { name: "Users", icon: Users },
                { name: "Analytics", icon: BarChart2 },
                { name: "AI Insights", icon: Zap },
              ].map((item) => (
                <Button
                  key={item.name}
                  onClick={() =>
                    setActiveView(item.name.toLowerCase().replace(" ", "-"))
                  }
                  variant="ghost"
                  className={`w-full justify-start ${
                    activeView === item.name.toLowerCase().replace(" ", "-")
                      ? "bg-indigo-600 text-white hover:bg-indigo-600 hover:text-white"
                      : "text-indigo-100 hover:bg-indigo-600 hover:text-white"
                  }`}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.name}
                </Button>
              ))}
            </nav>
          </ScrollArea>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="container w-11/12 mx-auto py-10">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              {activeView
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </header>
          {renderCurrentView()}
        </div>
      </main>
    </div>
  );
};

export default VerificationPage;
