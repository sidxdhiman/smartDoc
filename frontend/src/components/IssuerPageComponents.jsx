import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus } from 'lucide-react';
import { Upload, Database, FileSpreadsheet, Image as ImageIcon } from 'lucide-react';

// Document Templates Component
const DocumentTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('id-card');
  
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Document Templates</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>ID Card Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg p-4 border-2 border-dashed flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Template Preview</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Template Fields:</h4>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  <li>Full Name</li>
                  <li>Employee ID</li>
                  <li>Department</li>
                  <li>Photo</li>
                  <li>Issue Date</li>
                </ul>
              </div>
              <Button className="w-full">Edit Template</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed">
          <CardContent className="h-full flex items-center justify-center p-6">
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Template
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const BulkDocumentIssuance = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  
  // Ref for the hidden file input
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      setIsModalOpen(false);
      setIsSuccess(true);
      setIsPopupVisible(true);

      // Simulate a delay for the popup
      setTimeout(() => {
        setIsPopupVisible(false);
      }, 3000);

      // Reset file selection
      setSelectedFile(null);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }
  };

  // Function to programmatically trigger file input click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Bulk Document Issuance</h2>

      {/* Trigger File Upload */}
      <Button
        onClick={handleUploadClick}
        className="mb-4"
      >
        Upload CSV
      </Button>

      {/* Hidden File Input */}
      <Input
        type="file"
        accept=".csv"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileSelect}
      />

      {/* Success Message */}
      {isSuccess && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription>Documents successfully issued!</AlertDescription>
        </Alert>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          {/* Modal Content */}
          <Card className="w-full max-w-md bg-white">
            <CardHeader>
              <CardTitle>Upload CSV File</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : 'No file selected'}
                </p>
              </div>

              <Alert>
                <AlertDescription>
                  Make sure your CSV follows our template format.
                  <a href="#" className="underline ml-1">Download template</a>
                </AlertDescription>
              </Alert>

              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedFile}
                >
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Popup Message */}
      {isPopupVisible && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg">
          CSV successfully uploaded into Database!
        </div>
      )}
    </div>
  );
};


// Analytics Component
const Analytics = () => {
  const dummyData = {
    issuedDocuments: 1234,
    activeTemplates: 8,
    averageProcessingTime: '2.5 minutes',
    topDepartments: [
      { name: 'HR', count: 450 },
      { name: 'IT', count: 380 },
      { name: 'Sales', count: 290 },
    ]
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Analytics & Insights</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dummyData.issuedDocuments}</div>
            <p className="text-sm text-gray-500">Documents issued this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dummyData.averageProcessingTime}</div>
            <p className="text-sm text-gray-500">Average processing time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dummyData.activeTemplates}</div>
            <p className="text-sm text-gray-500">Templates in use</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dummyData.topDepartments.map((dept, index) => (
              <div key={index} className="flex items-center justify-between">
                <span>{dept.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: `${(dept.count / dummyData.issuedDocuments) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{dept.count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Settings Component
const Settings = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input placeholder="Enter organization name" />
              </div>
              <div className="space-y-2">
                <Label>Default Template</Label>
                <select className="w-full rounded-md border border-gray-300 p-2">
                  <option>ID Card Template</option>
                  <option>Certificate Template</option>
                </select>
              </div>
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input type="password" value="************************" readOnly />
                  <Button variant="outline">Copy</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <Input placeholder="https://your-webhook-url.com" />
              </div>
              <Button>Update API Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { DocumentTemplates, BulkDocumentIssuance, Analytics, Settings };