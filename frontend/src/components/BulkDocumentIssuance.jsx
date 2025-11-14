import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const BulkDocumentIssuance = () => {
  const [uploadMethod, setUploadMethod] = useState('csv');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type !== 'text/csv') {
      toast({
        title: 'Error',
        description: 'Please select a CSV file',
        variant: 'destructive',
      });
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'Error',
        description: 'Please select a file first',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload-students', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error uploading file');
      }

      toast({
        title: 'Success',
        description: `Successfully uploaded ${data.count} student records`,
      });
      
      // Close modal and reset state
      setIsModalOpen(false);
      setSelectedFile(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Bulk Document Issuance</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload CSV File</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop your CSV file here, or click to browse
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsModalOpen(true)}
                >
                  Choose File
                </Button>
              </div>
              <Alert>
                <AlertDescription>
                  Make sure your CSV follows our template format. 
                  <a href="#" className="underline ml-1">Download template</a>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload CSV File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="modal-file-upload"
              />
              <label
                htmlFor="modal-file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : 'Click to select CSV file'}
                </span>
              </label>
            </div>
            {selectedFile && (
              <div className="flex items-center gap-2 text-sm">
                <span className="flex-1 truncate">{selectedFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BulkDocumentIssuance;