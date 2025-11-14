import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const DocumentRequests = () => {
  const [requests] = useState([
    { id: 1, documentName: 'Birth Certificate', requester: 'Rahul Sharma', status: 'Pending' },
    { id: 2, documentName: 'Class X Marksheet', requester: 'Priya Gupta', status: 'Approved' },
    { id: 3, documentName: 'Driving License', requester: 'Kunal Jain', status: 'Pending' },
    { id: 4, documentName: 'Passport', requester: 'Sonia Singh', status: 'Rejected' },
    { id: 5, documentName: 'Aadhaar Card', requester: 'Rohan Patel', status: 'Approved' },
    { id: 6, documentName: 'Voter ID', requester: 'Neha Agarwal', status: 'Pending' },
    { id: 7, documentName: 'PAN Card', requester: 'Amit Kumar', status: 'Approved' },
    { id: 8, documentName: 'Utility Bill', requester: 'Swati Mishra', status: 'Rejected' },
]);

  const handleApprove = (id) => {
    // Implement the logic to approve the request here
    console.log(`Approved request with ID: ${id}`);
  };

  const handleReject = (id) => {
    // Implement the logic to reject the request here
    console.log(`Rejected request with ID: ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Document Requests</h1>

        {/* Requests Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Document Name</th>
                <th className="py-3 px-6 text-left">Requester</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="bg-gray-50 border-b">
                  <td className="py-3 px-6">{request.documentName}</td>
                  <td className="py-3 px-6">{request.requester}</td>
                  <td className={`py-3 px-6 ${request.status === 'Approved' ? 'text-green-500' : 'text-red-500'}`}>
                    {request.status === 'Approved' ? <FaCheckCircle className="mr-2" /> : <FaTimesCircle className="mr-2" />}
                    {request.status}
                  </td>
                  <td className="py-3 px-6">
                    {request.status === 'Pending' ? (
                      <div className="flex space-x-2">
                        <button onClick={() => handleApprove(request.id)} className="bg-green-500 text-white px-3 py-1 rounded">
                          Approve
                        </button>
                        <button onClick={() => handleReject(request.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DocumentRequests;
