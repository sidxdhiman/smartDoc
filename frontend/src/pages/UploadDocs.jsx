import React, { useState } from 'react';

const UploadDocument = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Uploading: ', file);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Upload Document</h1>

        {/* Upload form */}
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700">Document Name</label>
              <input type="text" required placeholder="e.g., Birth Certificate" className="w-full mt-2 p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-gray-700">Upload File</label>
              <input type="file" onChange={handleFileChange} required className="w-full mt-2 p-2 border border-gray-300 rounded" />
            </div>
            <button type="submit" className="bg-blue-900 text-white px-6 py-3 rounded shadow hover:bg-blue-800">
              Upload Document
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
