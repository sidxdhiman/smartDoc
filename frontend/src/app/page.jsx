import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { DocumentList } from "@/components/document-list";
import { MetricsCard } from "@/components/metrics-card";
import { SearchFilters } from "@/components/search-filters";
import { Bell, FileText, Files, Users, Send } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [issuingDocuments, setIssuingDocuments] = useState({});

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/getrequests`);
        if (!response.ok) {
          throw new Error('Failed to fetch requests');
        }
        const data = await response.json();
        setRequests(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Issue document function
  const issueDocument = async (requestId, documentType) => {
    // Prevent multiple simultaneous requests for the same document
    if (issuingDocuments[requestId]) return;

    try {
      // Update issuing state
      setIssuingDocuments(prev => ({...prev, [requestId]: true}));

      // Send POST request to issue document
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/issuedoc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          documentType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to issue document');
      }

      // Parse response
      const result = await response.json();

      // Update UI - remove the issued document or update its status
      setRequests(prevRequests => 
        prevRequests.map(request => 
          request._id === requestId 
            ? {...request, status: 'Issued'} 
            : request
        )
      );

      // Show success toast
      toast.success('Document Issued Successfully', {
        description: `${documentType} for ${result.name} has been issued.`
      });
    } catch (err) {
      // Show error toast
      toast.error('Failed to Issue Document', {
        description: err.message
      });
    } finally {
      // Reset issuing state
      setIssuingDocuments(prev => ({...prev, [requestId]: false}));
    }
  };

  // Calculate metrics
  const totalIssued = requests.length;
  const pendingApprovals = requests.filter(req => req.status === 'Pending').length;

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, Gurugram University
          </h1>
          <p className="text-muted-foreground">
            Issue, manage, and track documents effortlessly
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button>New Document</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <MetricsCard
          title="Total Issued"
          value={totalIssued.toString()}
          icon={<Files />}
          trend={{ value: 0, isPositive: true }}
        />
        <MetricsCard
          title="Pending Approvals"
          value={pendingApprovals.toString()}
          icon={<FileText />}
          trend={{ value: 0, isPositive: true }}
        />
        <MetricsCard
          title="Templates Created"
          value="1"
          icon={<Users />}
          trend={{ value: 1, isPositive: true }}
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Recent Documents
          </h2>
          <Button variant="link">View all documents</Button>
        </div>
        <SearchFilters />
        
        {loading ? (
          <div className="w-full py-4 text-center text-muted-foreground">
            Loading requests...
          </div>
        ) : error ? (
          <div className="w-full py-4 text-center text-destructive">
            Error: {error}
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Name
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      UID
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Created At
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Document Type
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {requests.map((request) => (
                    <tr 
                      key={request._id} 
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        {request.name}
                      </td>
                      <td className="p-4 align-middle">
                        {request.UID}
                      </td>
                      <td className="p-4 align-middle">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          request.status === 'Pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="p-4 align-middle">
                        {request.documentType}
                      </td>
                      <td className="p-4 align-middle">
                        <Button 
                          size="sm" 
                          variant="outline"
                          disabled={request.status !== 'Pending' || issuingDocuments[request._id]}
                          onClick={() => issueDocument(request._id, request.documentType)}
                        >
                          {issuingDocuments[request._id] ? 'Issuing...' : 'Issue'}
                          <Send className="ml-2 h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}