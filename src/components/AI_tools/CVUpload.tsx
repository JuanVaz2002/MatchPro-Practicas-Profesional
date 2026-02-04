import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Candidate } from '../../types';

// Utility function to determine the appropriate URL based on candidate CV link
// The function now accepts the candidate CV link (if any), parses its hostname
// and verifies that the link itself is accessible. Both must be true to use
// the overwrite endpoint; otherwise the upload endpoint is used as a fallback.
const getConditionalUploadUrl = async (cvLink?: string): Promise<string> => {
  const OVERWRITE_URL = 'http://localhost:5678/webhook/overwrite-cv-candidate';
  const UPLOAD_URL = 'http://localhost:5678/webhook/upload-cv-candidate';

  try {
    if (!cvLink) {
      console.log('No CV link provided; using upload endpoint');
      return UPLOAD_URL;
    }

    let hostname = '';
    try {
      hostname = new URL(cvLink).hostname;
    } catch (err) {
      console.warn('Invalid CV link URL, falling back to upload endpoint:', cvLink, err);
      return UPLOAD_URL;
    }

    const isDropboxDomain = hostname.toLowerCase().includes('dropbox');
    console.log('CV link hostname:', hostname, 'isDropboxDomain:', isDropboxDomain);

    // Test accessibility of the CV link itself
    const isLinkAccessible = await testLinkAccessibility(cvLink);
    console.log('CV link accessibility:', isLinkAccessible);

    if (isDropboxDomain && isLinkAccessible) {
      return OVERWRITE_URL;
    }

    return UPLOAD_URL;
  } catch (error) {
    console.error('Error determining URL, falling back to upload endpoint:', error);
    return UPLOAD_URL;
  }
};

// Helper function to test if a link is accessible
const testLinkAccessibility = async (url: string, timeoutMs: number = 5000): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // In no-cors mode, status 0 means the request succeeded
    return response.status === 0 || (response.status >= 200 && response.status < 400);
  } catch (error) {
    // Network error, timeout, or abort
    console.warn(`Link accessibility test failed for ${url}:`, error);
    return false;
  }
};

// import { Candidate } from '../../types';
interface CVUploadProps {
  candidate: Candidate;
}
export default function CVUpload({ candidate }: CVUploadProps) {

  const [scoreColor, setScoreColor] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log("file", e.target.files[0]);
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      setUploadError('Please upload a PDF file');
      setUploadedFile(null);
      return;
    }
    setUploadedFile(file);
    setUploadError('');
  };

  const handleUpload = async () => {
    if (!uploadedFile) {
      setUploadError('Please select a PDF file to upload.');
      return;
    }

    setUploading(true);
    setUploadError('');
    setAnalyzing(true);
    setAnalysisComplete(false);

    console.log(`number: ${candidate.aiAnalysis?.resume?.cv_id}`);
    const formData = new FormData();
    formData.append('name', candidate.name);
    formData.append('professionalTitle', candidate.professionalTitle || '');
    formData.append('file', uploadedFile);
    formData.append("number", candidate.aiAnalysis?.resume?.cv_id);
    

    // Determine the appropriate URL based on candidate's CV link domain and accessibility
    const cvLink = candidate?.aiAnalysis?.resume?.cv_link;
    const uploadUrl = await getConditionalUploadUrl(cvLink);
    
    try {
      // console.log(candidate.aiAnalysis?.resume?.cv_id);
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      console.log("Response:", response);
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response has content
      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        throw new Error('Empty response from server');
      }

      // Parse JSON
      const result = JSON.parse(responseText);
      console.log("Resultado del análisis:", result);
      console.log("File from result:", result["url"]);

      // Simulate AI analysis
      setTimeout(() => {
      setAnalyzing(false);
      setAnalysisComplete(true);
      setAiAnalysis({
        score: result["score"],
        strengths: result["strengths"],
        improvements: result["improvements"],
        keywords: result["keywords"],
        missingKeywords: result["missingKeywords"]
      });

      if (result["score"] >= 90) {
        console.log("Grade: A");
        setScoreColor("green");
      } else if (result["score"] >= 80) {
        setScoreColor("lime");
      } else if (result["score"] >= 70) {
        setScoreColor("yellow");
      } else if (result["score"] >= 60) {
        setScoreColor("orange");
      } else {
        setScoreColor("red");
      }
    }, 3000);

    const aiAnalysisData = {
      candidateId: candidate?.id,
      strengths: result["strengths"],
      concerns: result["concerns"],
      recommendation: result["recommendation"],
      matchScore: result["score"],
      cv_link: result["url"],
      cv_id: result["num"]
    };

    try {
      console.log('Saving AI analysis form data to MySQL:', aiAnalysisData);
      
      const response = await fetch('/api/aiAnalysisCandidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiAnalysisData),
      });

      const result_aiAnalysis = await response.json();
      console.log("API Response:", result_aiAnalysis);

      if (response.ok) {
        // setJobPosted(true);
        console.log(" AI analysis saved successfully:", result_aiAnalysis);
      } else {
        console.error('Failed to save  AI analysis:', result_aiAnalysis);
        alert(`Failed to save  AI analysis: ${result_aiAnalysis.error || result_aiAnalysis.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving  AI analysis:', error);
      alert(`Error saving  AI analysis: ${error.message}`);
    } finally {
      setTimeout(() => {
        // setIsSubmitting(false);
      }, 2000);
    }

    } catch (error) {
      console.error('Error uploading CV:', error);
      setUploadError(`Upload failed: ${error.message}`);
      setUploading(false);
      setAnalyzing(false);
      return;
    }
  };

  const optimizeForJob = (jobTitle: string) => {
    alert(`CV optimization for "${jobTitle}" will be available soon!`);
  };


  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload & Optimize Your CV</h1>
        </div>

        {uploadError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {uploadError}
          </div>
        )}

        {/* Removed uploadSuccess and analysisResult/optimizedPdfUrl UI blocks */}

        {!uploadedFile ? (
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload your CV
            </h3>
            <p className="text-gray-600 mb-6">
              Drag and drop your PDF file here, or click to browse
            </p>
            <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="hidden"
              />
              Choose File
            </label>
            <p className="text-sm text-gray-500 mt-4">
              Supports PDF files up to 10MB
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* File Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{uploadedFile.name}</h3>
                    <p className="text-sm text-gray-600">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Upload Button */}
            <button
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Send CV & Professional Title'}
            </button>
            {/* Change File Button */}
            <button
              className="w-full px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium mt-2"
              onClick={() => setUploadedFile(null)}
              disabled={uploading}
            >
              Choose a different file
            </button>

            {/* Analysis Status */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 rounded-lg ${analyzing ? 'bg-blue-100' : analysisComplete ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Sparkles className={`w-6 h-6 ${analyzing ? 'text-blue-600' : analysisComplete ? 'text-green-600' : 'text-gray-600'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Analysis</h3>
                  <p className="text-sm text-gray-600">
                    {analyzing ? 'Analyzing your CV...' : analysisComplete ? 'Analysis complete!' : 'Ready to analyze'}
                  </p>
                </div>
              </div>

              {analyzing && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              )}
            </div>

            {/* Analysis Results */}
            {analysisComplete && aiAnalysis && (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-24 h-24 bg-${scoreColor}-100 rounded-full mb-4`}>
                      <span className={`text-2xl font-bold text-${scoreColor}-600`}>{aiAnalysis.score}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Match Score</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Strengths
                    </h3>
                    <ul className="space-y-3">
                      {aiAnalysis.strengths.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                   {/* Improvements */}
                   <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
                      Suggested Improvements
                    </h3>
                    <ul className="space-y-3">
                      {aiAnalysis.improvements.map((improvement: string, index: number) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                 {/* Keywords Analysis */}
                 <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyword Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Found Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiAnalysis.keywords.map((keyword: string, index: number) => (
                          <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Missing Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiAnalysis.missingKeywords.map((keyword: string, index: number) => (
                          <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}