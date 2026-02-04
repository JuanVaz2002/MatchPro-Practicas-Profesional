import React, { useState, useCallback } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  User, 
  GraduationCap, 
  Briefcase, 
  Award, 
  MapPin, 
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowLeft 
} from 'lucide-react';
import { Education, WorkExperience, JobPreferences, Certification, Candidate, RECRUITMENT_SOURCES } from '../../../types';

interface CandidateRegistrationWizardProps {
  onBack: () => void;
  recruiterID?: number;
}

export default function CandidateRegistrationWizard({ onBack, recruiterID }: CandidateRegistrationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [salaryRangeInput, setSalaryRangeInput] = useState('');
  const [salaryRangeError, setSalaryRangeError] = useState('');
  
  // CV Upload states
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  
  const [result, setResult] = useState({
      score: 0,
      strengths: [],
      concerns: [],
      recommendation: '',
      improvements: [],
      keywords: [],
      missingKeywords: [],
      cv_link: ''
  })

  const [candidateData, setCandidateData] = useState<Partial<Candidate>>({
    name: '',
    email: '',
    password: '',
    phone: '',
    experience: 0,
    location: '',
    jobPreferences: {
      salary : {
        min: 0,
        max: 0
      },
      jobType: 'full-time',
      location: []
    },
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  
  
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [scoreColor, setScoreColor] = useState<string>('');

  // Form data state
  const [basicInfo, setBasicInfo] = useState<Partial<Candidate>>({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    experience: 0,
    professionalTitle: '',
    recruitmentSource: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    email: '',
    phone: ''
  });

  const [jobPreferences, setJobPreferences] = useState<{
    salary: { min: number; max: number };
    location: string[];
    jobType: JobPreferences['jobType'] | '';
  }>({
    salary: { min: 0, max: 0 },
    location: [''],
    jobType: ''
  });


  const steps = [
    { title: 'Basic Information', icon: User },
    { title: 'Upload CV', icon: Upload }
  ];

  const jobTypes = [
    { value: '', label: 'Select type of job...' },
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Internship' },
    { value: 'temporary', label: 'Temporary' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'other', label: 'Other' }
  ];

  const recruitmentSources = [
    { value: '', label: 'Select recruitment source...' },
    ...RECRUITMENT_SOURCES.map(s => ({
        value: s.value,
        label: s.label
      }))
  ];
  
  // Email formatting function
  const formatEmail = (value: string): string => {
    return value.toLowerCase().trim();
  };

  // Phone formatting function
  const formatPhone = (value: string): string => {
    // Remove all non-numeric characters
    const numbersOnly = value.replace(/\D/g, '');
    // Limit to 10 digits
    return numbersOnly.slice(0, 10);
  };

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-z0-9._]+@[a-z0-9]+\.[a-z.]{2,}$/;
    return emailRegex.test(email);
  };

  // Phone validation
  const validatePhone = (phone: string): boolean => {
    return phone.length === 10 && /^\d{10}$/.test(phone);
  };

  // Salary range handler
  const handleSalaryRangeChange = (value: string) => {
    const numbersAndDashOnly = value.replace(/[^0-9-]/g, '');
    setSalaryRangeInput(numbersAndDashOnly);
    setSalaryRangeError('');

    // Validate format: number-number
    const salaryPattern = /^(\d+)-(\d+)$/;
    const match = numbersAndDashOnly.match(salaryPattern);

    if (!match) {
      if (numbersAndDashOnly.trim() !== '') {
        setSalaryRangeError('Please use format: minimum-maximum (e.g., 50000-75000)');
      }
      return;
    }

    const minSalary = parseInt(match[1]);
    const maxSalary = parseInt(match[2]);

    // Validate that minimum is less than maximum
    if (minSalary >= maxSalary) {
      setSalaryRangeError('Minimum salary must be less than maximum salary');
      return;
    }

    // Validate reasonable salary ranges
    if (minSalary < 0 || maxSalary < 0) {
      setSalaryRangeError('Salary values must be positive');
      return;
    }

    // Update job preferences if valid
    setJobPreferences({
      ...jobPreferences,
      salary: { min: minSalary, max: maxSalary }
    });
  };
  
  // Basic info handlers
  const updateBasicInfo = (field: string, value: string | number | string[]) => {
    if (field === "email") {
      const formattedEmail = formatEmail(String(value));
      setBasicInfo(prev => ({ ...prev, email: formattedEmail }));

      // Validate email
      if (formattedEmail && !validateEmail(formattedEmail)) {
        setValidationErrors(prev => ({ 
          ...prev, 
          email: 'Email must be lowercase, follow [string]@[domain].com format' 
        }));
      } else {
        setValidationErrors(prev => ({ ...prev, email: '' }));
      }
    }
    else if (field === "phone") {
      const formattedPhone = formatPhone(String(value));
      setBasicInfo(prev => ({ ...prev, phone: formattedPhone }));

      // Validate phone
      if (formattedPhone && !validatePhone(formattedPhone)) {
        setValidationErrors(prev => ({ 
          ...prev, 
          phone: 'Phone must be exactly 10 digits (numbers only)' 
        }));
      } else {
        setValidationErrors(prev => ({ ...prev, phone: '' }));
      }
    }

    else
    {
      setBasicInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  // Job preferences handlers
  const addLocation = () => {
    setJobPreferences({
      ...jobPreferences,
      location: [...jobPreferences.location, '']
    });
  };

  const removeLocation = (index: number) => {
    if (jobPreferences.location.length > 1) {
      setJobPreferences({
        ...jobPreferences,
        location: jobPreferences.location.filter((_, i) => i !== index)
      });
    }
  };

  const updateLocation = (index: number, value: string) => {
    const updated = jobPreferences.location.map((loc, i) => 
      i === index ? value : loc
    );
    setJobPreferences({ ...jobPreferences, location: updated });
  };

  // CV Upload handlers
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

    // Normalize job preferences to match type union (non-empty)
    const normalizedJobPreferences: JobPreferences = {
      salary: { min: jobPreferences.salary.min, max: jobPreferences.salary.max },
      location: jobPreferences.location,
      jobType: jobPreferences.jobType as JobPreferences['jobType'],
    };

    // Prepare form data
    const formData = new FormData();
    formData.append('name', basicInfo.name || "");
    formData.append('professionalTitle', basicInfo.professionalTitle || "");
    formData.append('file', uploadedFile);


    try {
      // Simulate API call - replace with actual endpoint
      const response = await fetch('http://localhost:5678/webhook-test/upload-cv-candidate', {
        method: 'POST',
        body: formData,
      });
      

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Parse the response safely (handle empty or non-JSON bodies)
      let responseData: any = {};
      try {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          const text = await response.text();
          if (text) {
            try {
              responseData = JSON.parse(text);
            } catch (e) {
              console.warn('Upload response not valid JSON, using raw text as message', text);
              responseData = { message: text };
            }
          } else {
            responseData = {};
          }
        }
      } catch (err) {
        console.warn('Failed to parse upload response:', err);
        responseData = {};
      }

      console.log("Response data:", responseData); // DEBUG

      // Create analysis results with safety checks
      const analysis = {
        score: typeof responseData.score === 'number' ? responseData.score : 0,
        strengths: Array.isArray(responseData.strengths) ? responseData.strengths : [],
        concerns: Array.isArray(responseData.concerns) ? responseData.concerns : [],
        recommendation: responseData.recommendation || responseData.message || '',
        improvements: Array.isArray(responseData.improvements) ? responseData.improvements : [],
        keywords: Array.isArray(responseData.keywords) ? responseData.keywords : [],
        missingKeywords: Array.isArray(responseData.missingKeywords) ? responseData.missingKeywords : [],
        cv_link: responseData.url || '',
        cv_id: responseData.cv_id || ''
      };

      setResult(analysis);
      setAiAnalysis(analysis);
      setAnalyzing(false);
      setAnalysisComplete(true);

      if (analysis.score >= 90) {
        setScoreColor("green");
      } else if (analysis.score >= 80) {
        setScoreColor("lime");
      } else if (analysis.score >= 70) {
        setScoreColor("yellow");
      } else if (analysis.score >= 60) {
        setScoreColor("orange");
      } else {
        setScoreColor("red");
      }
      console.log("Analysis:", analysis);

      // Populate candidateData with basic info and normalized job preferences, plus a brief AI summary
      setCandidateData(prev => ({
        ...prev,
        ...basicInfo,
        jobPreferences: normalizedJobPreferences,
        cvUploaded: true,
        aiAnalysis: {
          strengths: analysis.strengths,
          concerns: analysis.concerns,
          recommendation: analysis.recommendation,
          matchScore: analysis.score,
          resume: {
            cv_link: analysis.cv_link || '',
            cv_id: analysis.cv_id || '',
            uploadedAt: new Date().toISOString()
          }
        }
      }));
    } catch (error) {
      console.error('Error uploading CV:', error);
      setUploadError('Upload failed. Please try again.');
      setAnalyzing(false);
    }
    finally {
      setUploading(false);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response2 = await fetch('/api/addCandidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateData,
          recruiterID,
          aiAnalysis: result
        })
      });
      
      const result2 = await response2.json();
      console.log("API Response:", result2);

      if (response2.ok) {
        console.log(`Candidate added successfully:`, result2);
        const displayName = (candidateData as any)?.name || (candidateData as any)?.email || 'candidate';
        alert(`Profile has been created for ${displayName}.`);
        onBack();
        return;
      } else {
        console.error(`Failed to add candidate:`, result2);
        alert(`Failed to add candidate: ${result2.error || result2.message || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error('Error creating candidate profile:', err);
      alert(`Error creating candidate profile: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step validation
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0: // Basic Information
        return !!(
          validateEmail(basicInfo.email ?? '') && 
          basicInfo.password && 
          validatePhone(basicInfo.phone ?? '') && 
          basicInfo.professionalTitle && 
          !validationErrors.email && 
          !validationErrors.phone && 
          jobPreferences.jobType && 
          jobPreferences.salary.min < jobPreferences.salary.max && 
          (basicInfo.recruitmentSource ?? '') !== '' && 
          basicInfo.name !== '' && 
          basicInfo.name
        );
      case 1: // CV Upload
        return analysisComplete;
      default:
        return false;
    }
  };

  // Form step renderers
  const renderBasicInformation = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
          <p className="text-gray-600 mt-2">Tell us about yourself and your professional background</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={basicInfo.name}
                onChange={(e) => updateBasicInfo('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={basicInfo.email}
                onChange={(e) => updateBasicInfo('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., johndoe2016@hacks.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña *
              </label>
              <input
                type="password"
                value={basicInfo.password}
                onChange={(e) => updateBasicInfo('password', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., password#1234"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numero telefonico 
              </label>
              <input
                type="tel"
                value={basicInfo.phone}
                onChange={(e) => updateBasicInfo('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 1234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación
              </label>
              <input
                type="text"
                value={basicInfo.location}
                onChange={(e) => updateBasicInfo('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol Actual *
              </label>
              <input
                type="text"
                value={basicInfo.professionalTitle}
                onChange={(e) => updateBasicInfo('professionalTitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Senior Software Developer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Años de Experiencia
              </label>
              <input
                type="number"
                value={basicInfo.experience}
                onChange={(e) => updateBasicInfo('experience', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="5"
                min="0"
                max="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recruitment Source *
              </label>
              <select
                value={basicInfo.recruitmentSource}
                onChange={(e) => updateBasicInfo('recruitmentSource', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {recruitmentSources.map((source) => (
                  <option key={source.value} value={source.value}>
                    {source.label}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expectativa salarial *</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={salaryRangeInput}
                onChange={(e) => handleSalaryRangeChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="50000-75000"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter minimum and maximum salary separated by a hyphen (e.g., 45000-65000)
              </p>
              {salaryRangeError && (
                <p className="text-xs text-red-600 mt-1">{salaryRangeError}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Preference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Type
              </label>
              <select
                value={jobPreferences.jobType}
                onChange={(e) => setJobPreferences({ ...jobPreferences, jobType: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {jobTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Locations
              </label>
          
              {jobPreferences.location.map((location, index) => (
                <div key={index} className="flex items-center space-x-3 mb-3">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => updateLocation(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Helsinki, Finland or Remote"
                  />
                  {jobPreferences.location.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLocation(index)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addLocation}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
                >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Location
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCVUpload = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Upload Your CV</h2>
        <p className="text-gray-600 mt-2">Upload and analyze your CV to complete your profile</p>
      </div>

      {uploadError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {uploadError}
        </div>
      )}

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

          {!analysisComplete && (
            <>
              <button
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? 'Analyzing CV...' : 'Upload & Analyze CV'}
              </button>

              <button
                className="w-full px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium mt-2"
                onClick={() => setUploadedFile(null)}
                disabled={uploading}
              >
                Choose a different file
              </button>
            </>
          )}

          {/* Analysis Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4 mb-4">
              <div className={`p-3 rounded-lg ${analyzing ? 'bg-blue-100' : analysisComplete ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Sparkles className={`w-6 h-6 ${analyzing ? 'text-blue-600 animate-pulse' : analysisComplete ? 'text-green-600' : 'text-gray-600'}`} />
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

          {/* Allow replacing the CV after analysis */}
          {analysisComplete && (
            <div className="flex items-center gap-3">
              <button
                className="px-6 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                onClick={() => {
                  // allow user to download or view cv link if available; if none, just clear file
                  if (aiAnalysis && aiAnalysis.cv_link) {
                    window.open(aiAnalysis.cv_link, '_blank');
                  } 
                }}
              >
                View CV
              </button>
            </div>
          )}

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
                  <p className="text-gray-600 mt-1">Your CV has been successfully analyzed!</p>
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
                    {aiAnalysis.strengths && aiAnalysis.strengths.length > 0 ? (
                      aiAnalysis.strengths.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{strength}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500">No strengths identified</li>
                    )}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
                    Suggested Improvements
                  </h3>
                  <ul className="space-y-3">
                    {aiAnalysis.improvements && aiAnalysis.improvements.length > 0 ? (
                      aiAnalysis.improvements.map((improvement: string, index: number) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{improvement}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500">No improvements suggested</li>
                    )}
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
                      {aiAnalysis.keywords && aiAnalysis.keywords.length > 0 ? (
                        aiAnalysis.keywords.map((keyword: string, index: number) => (
                          <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            {keyword}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">No keywords found</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Missing Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.missingKeywords && aiAnalysis.missingKeywords.length > 0 ? (
                        aiAnalysis.missingKeywords.map((keyword: string, index: number) => (
                          <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                            {keyword}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">No missing keywords identified</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInformation();
      case 1:
        return renderCVUpload();
      default:
        return renderBasicInformation();
    }
  };

  const resetRegistration = () => {
    setCurrentStep(0);
    setIsSubmitting(false);
    setDragActive(false);
    setUploadedFile(null);
    setUploading(false);
    setUploadError('');
    setResult({
      score: 0,
      strengths: [],
      concerns: [],
      recommendation: '',
      improvements: [],
      keywords: [],
      missingKeywords: [],
      cv_link: ''
    });
    setCandidateData({
      email: '',
      password: '',
      phone: '',
      experience: 0,
      professionalTitle: '',
      jobPreferences: {
        salary: { min: 0, max: 0 },
        jobType: 'full-time',
        location: []
      }
    });
    setAnalyzing(false);
    setAnalysisComplete(false);
    setAiAnalysis(null);
    setScoreColor('');
    setBasicInfo({
      name: '',
      email: '',
      password: '',
      phone: '',
      location: '',
      experience: 0,
      professionalTitle: '',
      recruitmentSource: ''
    });
    setSalaryRangeInput('');
    setJobPreferences({
      salary: { min: 0, max: 0 },
      location: [''],
      jobType: ''
    });
    setValidationErrors({ email: '', phone: '' });
  };



  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-[1904px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
        <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              ← Back to Candidates
        </button>
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Your Professional Profile</h1>
          <p className="text-gray-600 mt-2">
            Complete all steps to build a comprehensive profile that attracts top employers
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const isValid = isStepValid(index);
              
              return (
                <div key={index} className="flex items-center flex-shrink-0">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive 
                      ? 'border-blue-600 bg-blue-600 text-white' 
                      : isCompleted 
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`ml-2 text-sm font-medium whitespace-nowrap ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-gray-300 mx-4 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="mb-8">
          {renderCurrentStep()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            (() => {
              const analysisIsEmpty = !!(analysisComplete && aiAnalysis &&
                aiAnalysis.score === 0 &&
                (!aiAnalysis.recommendation || aiAnalysis.recommendation.trim() === '') &&
                (!aiAnalysis.cv_link || aiAnalysis.cv_link.trim() === '') &&
                Array.isArray(aiAnalysis.strengths) && aiAnalysis.strengths.length === 0 &&
                Array.isArray(aiAnalysis.concerns) && aiAnalysis.concerns.length === 0 &&
                Array.isArray(aiAnalysis.improvements) && aiAnalysis.improvements.length === 0 &&
                Array.isArray(aiAnalysis.keywords) && aiAnalysis.keywords.length === 0 &&
                Array.isArray(aiAnalysis.missingKeywords) && aiAnalysis.missingKeywords.length === 0);

              if (analysisIsEmpty) {
                return (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={resetRegistration}
                      className="flex items-center px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Reset Registration
                    </button>
                  </div>
                );
              }

              return (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isStepValid(currentStep)}
                  className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Creating Profile...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
}