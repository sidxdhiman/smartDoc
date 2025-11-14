import React, { useState, useEffect } from 'react';
import {
  FileText,
  Bell,
  Info,
  CheckCircle,
  XCircle,
  Eye,
  Home,
  AlertTriangle,
  Clock,
  BarChart2,
  Users,
  Zap,
  Shield,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const VerificationPage = () => {
  const [showMismatchDetails, setShowMismatchDetails] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    // Simulate progress update
    const interval = setInterval(() => {
      setVerificationProgress(prev => (prev < 100 ? prev + 10 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleInfoClick = (index) => {
    setShowMismatchDetails(index === showMismatchDetails ? null : index);
  };

  const handleApproval = (docId, action) => {
    console.log(`Document ${docId} ${action} approved`);
    // Here you would typically update the state or make an API call
  };

  const verificationRequests = [
    {
      docType: "Passport",
      user: "Emma Thompson",
      date: "2023-12-01",
      anomalyScore: "92%",
      crossDocMatching: "No",
      mismatchedFields: [
        { field: "Date of Birth", doc1Value: "1990-05-15", doc2Value: "1990-05-16" },
      ],
      docId: "PP-2023-001",
      institution: "Department of Foreign Affairs",
      priority: "high",
      status: "pending",
      history: ["Submitted for review", "Cross document mismatch detected"],
      document1: { name: "Emma Thompson", dob: "1990-05-15", nationality: "British", passportNumber: "GBR123456" },
      document2: { name: "Emma Thompson", dob: "1990-05-16", nationality: "British", passportNumber: "GBR123456" },
    },
    {
      docType: "Driver's License",
      user: "Michael Chen",
      date: "2023-11-28",
      anomalyScore: "45%",
      crossDocMatching: "Yes",
      mismatchedFields: [],
      docId: "DL-2023-089",
      institution: "Department of Motor Vehicles",
      priority: "medium",
      status: "review",
      history: ["Submitted for review", "Anomaly detected in signature"],
      document1: { name: "Michael Chen", dob: "1988-09-22", licenseNumber: "DL78901234", expiryDate: "2028-09-22" },
      document2: { name: "Michael Chen", dob: "1988-09-22", licenseNumber: "DL78901234", expiryDate: "2028-09-22" },
    },
    {
      docType: "Marriage Certificate",
      user: "Sophia Rodriguez",
      date: "2023-12-05",
      anomalyScore: "12%",
      crossDocMatching: "Yes",
      mismatchedFields: [],
      docId: "MC-2023-567",
      institution: "City Hall",
      priority: "low",
      status: "approved",
      history: ["Submitted for review", "Approved"],
      document1: { spouse1: "Sophia Rodriguez", spouse2: "Daniel Lee", dateOfMarriage: "2023-11-15", certificateNumber: "MC123456" },
      document2: { spouse1: "Sophia Rodriguez", spouse2: "Daniel Lee", dateOfMarriage: "2023-11-15", certificateNumber: "MC123456" },
    },
    {
      docType: "University Degree",
      user: "Alexander Johnson",
      date: "2023-12-03",
      anomalyScore: "78%",
      crossDocMatching: "No",
      mismatchedFields: [
        { field: "Graduation Date", doc1Value: "2022-06-15", doc2Value: "2022-07-15" },
      ],
      docId: "UD-2023-234",
      institution: "Stanford University",
      priority: "high",
      status: "pending",
      history: ["Submitted for review", "Cross document mismatch detected"],
      document1: { name: "Alexander Johnson", degree: "Bachelor of Science", major: "Computer Science", graduationDate: "2022-06-15" },
      document2: { name: "Alexander Johnson", degree: "Bachelor of Science", major: "Computer Science", graduationDate: "2022-07-15" },
    },
    {
      docType: "Birth Certificate",
      user: "Olivia Brown",
      date: "2023-11-30",
      anomalyScore: "5%",
      crossDocMatching: "Yes",
      mismatchedFields: [],
      docId: "BC-2023-789",
      institution: "National Registry",
      priority: "low",
      status: "approved",
      history: ["Submitted for review", "Approved"],
      document1: { name: "Olivia Brown", dateOfBirth: "2023-11-10", placeOfBirth: "London", parentNames: "Emily and James Brown" },
      document2: { name: "Olivia Brown", dateOfBirth: "2023-11-10", placeOfBirth: "London", parentNames: "Emily and James Brown" },
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-orange-100 text-orange-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'low': return <Info className="h-5 w-5 text-blue-500" />;
      default: return null;
    }
  };

  const filteredRequests = verificationRequests
    .filter(req => filter === 'all' || req.status === filter)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      }
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return sortOrder === 'asc' 
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

  return (
    (<div
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div
              className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">SmartDoc</span>
          </div>

          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="#" className="flex items-center space-x-3">
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="#" className="flex items-center space-x-3">
                <FileText className="h-5 w-5" />
                <span>Documents</span>
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="#" className="flex items-center space-x-3">
                <Users className="h-5 w-5" />
                <span>Users</span>
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="#" className="flex items-center space-x-3">
                <BarChart2 className="h-5 w-5" />
                <span>Analytics</span>
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="#" className="flex items-center space-x-3">
                <Zap className="h-5 w-5" />
                <span>AI Insights</span>
              </a>
            </Button>
          </nav>
        </div>
      </aside>
      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Verification Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor and manage document verifications</p>
            </div>
            <div className="flex items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Bell className="h-5 w-5 text-gray-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">-5% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verification Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.5%</div>
                <p className="text-xs text-muted-foreground">+2.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.7%</div>
                <p className="text-xs text-muted-foreground">+0.2% from last week</p>
              </CardContent>
            </Card>
          </div>

          {/* Verification Progress */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Verification Progress</CardTitle>
              <CardDescription>Real-time progress of document verifications</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={verificationProgress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">{verificationProgress}% of today's documents verified</p>
            </CardContent>
          </Card>

          {/* Verification Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Requests</CardTitle>
              <CardDescription>Manage and review document verification requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="review">Under Review</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                </TabsList>
                <TabsContent value="pending">
                  <div className="space-y-4">
                    {filteredRequests.filter(req => req.status === 'pending').map((doc, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <Badge variant="outline" className={getStatusColor(doc.status)}>
                              {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                            </Badge>
                            <h3 className="text-lg font-semibold text-gray-900 mt-2">{doc.docType}</h3>
                            <p className="text-sm text-gray-500">{doc.institution}</p>
                          </div>
                          {getPriorityIcon(doc.priority)}
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">User:</span>
                            <span className="text-gray-900 font-medium">{doc.user}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Date:</span>
                            <span className="text-gray-900">{doc.date}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Anomaly Score:</span>
                            <span
                              className={`font-medium ${parseInt(doc.anomalyScore) > 80 ? 'text-red-600' : 'text-green-600'}`}>
                              {doc.anomalyScore}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Cross Doc Match:</span>
                            <Badge variant={doc.crossDocMatching === 'Yes' ? 'success' : 'destructive'}>
                              {doc.crossDocMatching}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex space-x-2 mt-4">
                          <Button
                            onClick={() => handleApproval(doc.docId, 'approve')}
                            className="flex-1"
                            variant="outline">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleApproval(doc.docId, 'reject')}
                            className="flex-1"
                            variant="outline">
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button onClick={() => handleInfoClick(index)} variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="review">
                  {/* Similar structure as 'pending' tab, filtered for 'review' status */}
                </TabsContent>
                <TabsContent value="approved">
                  {/* Similar structure as 'pending' tab, filtered for 'approved' status */}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      {/* Mismatch Info Details Modal */}
      <AnimatePresence>
        {showMismatchDetails !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Document Comparison</h3>
                <Button onClick={() => setShowMismatchDetails(null)} variant="ghost" size="icon">
                  <XCircle className="h-6 w-6" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Document 1 */}
                <Card>
                  <CardHeader>
                    <CardTitle>Document 1</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {verificationRequests[showMismatchDetails].document1 && Object.entries(verificationRequests[showMismatchDetails].document1).map(([key, value]) => (
                        <div
                          key={key}
                          className={`p-2 rounded ${verificationRequests[showMismatchDetails].mismatchedFields.some(field => field.field.toLowerCase() === key.toLowerCase()) ? 'bg-red-100 text-red-800' : 'bg-gray-50'}`}>
                          <span className="font-semibold">{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                {/* Document 2 */}
                <Card>
                  <CardHeader>
                    <CardTitle>Document 2</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {verificationRequests[showMismatchDetails].document2 && Object.entries(verificationRequests[showMismatchDetails].document2).map(([key, value]) => (
                        <div
                          key={key}
                          className={`p-2 rounded ${verificationRequests[showMismatchDetails].mismatchedFields.some(field => field.field.toLowerCase() === key.toLowerCase()) ? 'bg-red-100 text-red-800' : 'bg-gray-50'}`}>
                          <span className="font-semibold">{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>)
  );
};

export default VerificationPage;

