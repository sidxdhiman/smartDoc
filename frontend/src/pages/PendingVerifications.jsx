import React, { useState } from 'react';

const PendingVerifications = () => {
  // Dummy data for pending documents
  const [pendingDocuments, setPendingDocuments] = useState([
    { id: 1, documentName: 'Academic Transcript', userName: 'John Doe', date: '12/08/2023', status: 'Pending', aiScore: null, analysis: '', previewUrl: 'https://example.com/transcript-preview.pdf' },
    { id: 2, documentName: 'Birth Certificate', userName: 'Jane Smith', date: '11/08/2023', status: 'Pending', aiScore: null, analysis: '', previewUrl: 'https://example.com/birth-cert-preview.pdf' },
    { id: 3, documentName: 'Pan Card', userName: 'Rahul Kumar', date: '10/08/2023', status: 'Pending', aiScore: null, analysis: '', previewUrl: 'https://example.com/pan-card-preview.pdf' },
    { id: 4, documentName: 'Aadhaar Card', userName: 'Priya Sharma', date: '09/08/2023', status: 'Pending', aiScore: null, analysis: '', previewUrl: 'https://example.com/aadhaar-card-preview.pdf' },
    { id: 5, documentName: 'Passport', userName: 'Rohan Jain', date: '08/08/2023', status: 'Pending', aiScore: null, analysis: '', previewUrl: 'https://example.com/passport-preview.pdf' },
  ]);
  
  const [loadingDoc, setLoadingDoc] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [currentDoc, setCurrentDoc] = useState(null);

  // Function to get AI analysis based on score
  const getAIAnalysis = (score) => {
    if (score >= 0.8) {
      return 'The document is highly likely to be legitimate. No issues detected.';
    } else if (score >= 0.5) {
      return 'The document appears to be legitimate, but further verification is recommended.';
    } else {
      return 'The document raises concerns and may require manual verification.';
    }
  };

  const handleAction = (id, type) => {
    setLoadingDoc(id);
    setActionType(type);
    // Simulate AI verification process
    setTimeout(() => {
      const aiScore = Math.random().toFixed(2); // Random score between 0.00 and 1.00
      const analysis = getAIAnalysis(aiScore); // Get analysis based on the AI score
      setPendingDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === id ? { ...doc, aiScore, analysis, status: 'Under Review' } : doc
        )
      );
      setModalOpen(true);
      setLoadingDoc(null);
    }, 2000); // Simulate a delay for AI processing
  };

  const confirmAction = (id) => {
    setPendingDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === id ? { ...doc, status: actionType === 'approve' ? 'Approved' : 'Rejected' } : doc
      )
    );
    setModalOpen(false);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const showAnalysis = (doc) => {
    setCurrentDoc(doc);
    setAnalysisModalOpen(true);
  };

  const closeAnalysisModal = () => {
    setAnalysisModalOpen(false);
  };

  const openPreview = (doc) => {
    setCurrentDoc(doc);
    setPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setPreviewModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Pending Verifications</h1>

        <table className="min-w-full bg-white shadow-lg rounded-lg">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Document Name</th>
              <th className="py-3 px-6 text-left">User</th>
              <th className="py-3 px-6 text-left">Date Submitted</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">AI Score</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingDocuments.map((doc) => (
              <tr key={doc.id} className="border-b">
                <td 
                  className="py-3 px-6 text-blue-600 cursor-pointer" 
                  onClick={() => openPreview(doc)}
                >
                  {doc.documentName}
                </td>
                <td className="py-3 px-6">{doc.userName}</td>
                <td className="py-3 px-6">{doc.date}</td>
                <td className="py-3 px-6">{doc.status}</td>
                <td className="py-3 px-6 flex items-center">
                  {doc.aiScore !== null ? (
                    <>
                      {doc.aiScore}
                      <button 
                        onClick={() => showAnalysis(doc)} 
                        className="ml-2 text-blue-500"
                      >
                        Info
                      </button>
                    </>
                  ) : 'N/A'}
                </td>
                <td className="py-3 px-6">
                  <button 
                    onClick={() => handleAction(doc.id, 'approve')} 
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                    disabled={doc.status !== 'Pending'}
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleAction(doc.id, 'reject')} 
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    disabled={doc.status !== 'Pending'}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loadingDoc && (
          <div className="mt-4 text-center">
            <span className="text-blue-600">Verifying document...</span>
            <div className="loader"></div> {/* Add a CSS loader for better visual feedback */}
          </div>
        )}

        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-4">{actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}</h2>
              <p>Are you sure you want to {actionType} this document?</p>
              <div className="mt-4">
                <button onClick={() => confirmAction(loadingDoc)} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Yes</button>
                <button onClick={closeModal} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">No</button>
              </div>
            </div>
          </div>
        )}

        {analysisModalOpen && currentDoc && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-4">AI Analysis for {currentDoc.documentName}</h2>
              <p>{currentDoc.analysis}</p>
              <div className="mt-4">
                <button onClick={closeAnalysisModal} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">Close</button>
              </div>
            </div>
          </div>
        )}

        {previewModalOpen && currentDoc && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-4">Preview of {currentDoc.documentName}</h2>
              <iframe 
                src={currentDoc.previewUrl} 
                title="Document Preview" 
                className="w-full h-96" 
                frameBorder="0"
              ></iframe>
              <div className="mt-4">
                <button onClick={closePreviewModal} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingVerifications;
