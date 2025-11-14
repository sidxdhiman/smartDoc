import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const DocumentEditor = () => {
  const [editorState, setEditorState] = useState('');

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'script',
    'indent',
    'direction',
    'size',
    'color', 'background',
    'font',
    'align',
    'link', 'image', 'video'
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Document Editor</h1>
          <p className="mt-2 text-gray-600">Create and preview your content in real-time</p>
        </div>
        
        <hr className="my-6 border-gray-200" />
        
        {/* Editor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Editor Section */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Editor</h2>
            </div>
            <div className="h-[600px] border rounded-lg overflow-hidden">
              <ReactQuill
                theme="snow"
                value={editorState}
                onChange={setEditorState}
                modules={modules}
                formats={formats}
                className="h-[520px]"
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Live Preview</h2>
            </div>
            <div 
              className="preview-content h-[600px] w-full rounded-lg border border-gray-200 bg-white p-4 overflow-auto"
              dangerouslySetInnerHTML={{ __html: editorState }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;