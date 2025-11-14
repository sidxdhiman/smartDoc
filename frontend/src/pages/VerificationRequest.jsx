import React, { useState } from 'react';

const SendForVerification = () => {
  const [formData, setFormData] = useState({
    documentType: '',
    recipientName: '',
    documentFile: null,
  });

  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedbackMessage('');
    
    // Logic for submitting the document for verification
    const formDataToSubmit = new FormData();
    for (const key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }
    
    try {
      // Simulate an API call to send the document for verification
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating network request
      
      setFeedbackMessage('Document sent for verification successfully!');
    } catch (error) {
      setFeedbackMessage('An error occurred while sending the document for verification. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Send Document for Verification</h1>

        {/* Feedback Message */}
        {feedbackMessage && (
          <div className={`p-4 mb-6 rounded ${feedbackMessage.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {feedbackMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-gray-700">Document Type</label>
            <select
              name="documentType"
              onChange={handleChange}
              value={formData.documentType}
              className="w-full mt-2 p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Type</option>
              <option value="birthCertificate">Birth Certificate</option>
              <option value="academicTranscript">Academic Transcript</option>
              <option value="experienceCertificate">Experience Certificate</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Recipient Name</label>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              required
              placeholder="e.g., Verification Authority Name"
              className="w-full mt-2 p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700">Upload Document</label>
            <input
              type="file"
              name="documentFile"
              onChange={handleChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-900 text-white px-6 py-3 rounded shadow hover:bg-blue-800"
          >
            Send for Verification
          </button>
        </form>

        {/* Example table of sent requests */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Sent Verification Requests</h2>
          <table className="min-w-full bg-white shadow-lg rounded-lg">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="py-3 px-6">Document Name</th>
                <th className="py-3 px-6">Recipient Name</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-6">Birth Certificate</td>
                <td className="py-3 px-6">John Doe</td>
                <td className="py-3 px-6">
                  <span className="px-2 py-1 rounded-lg bg-yellow-500 text-white">Sent for Verification</span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-6">Academic Transcript</td>
                <td className="py-3 px-6">Jane Smith</td>
                <td className="py-3 px-6">
                  <span className="px-2 py-1 rounded-lg bg-green-500 text-white">Verified</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SendForVerification;
