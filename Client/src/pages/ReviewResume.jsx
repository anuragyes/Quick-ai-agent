


import React, { useState } from 'react';
import { FileText, UploadCloud } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
 import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'; // Use your backend URL here

const ReviewResume = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
      setFileName(uploadedFile.name);
      setAnalysis(null); // Reset analysis on new upload
    } else {
      alert('Please upload a PDF resume.');
      setFile(null);
      setFileName('');
    }
  };

  const handleReview = async () => {
    if (!file) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      // Replace with your actual bearer token and API URL
      const token =  useAuth();
      const response = await axios('/api/ai/review-resume', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const result = await response.json();

      // Assume API returns { summary: "some analysis..." }
      setAnalysis(result.summary || `Analysis for "${file.name}" completed. ✅`);
    } catch (error) {
      console.error(error);
      setAnalysis('An error occurred while analyzing the resume.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex justify-center items-start">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">

        {/* LEFT: Resume Upload */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <UploadCloud className="text-green-500" />
            Resume Review
          </h2>

          <label className="block text-sm text-gray-700 mb-1">Upload Resume</label>

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gradient-to-r file:from-green-400 file:to-blue-500 file:text-white"
          />

          <p className="text-xs text-gray-500 mt-1">Supports PDF resume only.</p>

          <button
            onClick={handleReview}
            disabled={!file || isLoading}
            className="mt-4 w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium py-2 rounded-md hover:opacity-90 transition disabled:opacity-50"
          >
            <div className="flex justify-center items-center gap-2">
              <FileText className="w-4 h-4" />
              {isLoading ? 'Analyzing...' : 'Review Resume'}
            </div>
          </button>
        </div>

        {/* RIGHT: Analysis Results */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow min-h-[250px]">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <FileText className="text-green-500" />
            Analysis Results
          </h2>

          {isLoading ? (
            <div className="text-sm text-blue-500">Processing resume...</div>
          ) : analysis ? (
            <div className="text-sm text-gray-700 whitespace-pre-line">{analysis}</div>
          ) : (
            <div className="text-gray-400 text-sm flex flex-col items-center justify-center h-full">
              <span className="text-3xl mb-2">📄</span>
              Upload a resume and click <strong>"Review Resume"</strong> to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewResume;
