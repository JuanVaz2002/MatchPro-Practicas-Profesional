import React, { useState } from 'react';
import { Briefcase,  DollarSign, Clock, Users, Sparkles, CheckCircle } from 'lucide-react';
import { Job } from '../../../types';
import JobApplications from './JobApplications';
import ManageJobs from './ManageJobs';
interface PostJobProps {
  userID: number;
}

export default function PostJob({userID: recruiterID}: PostJobProps ) {
// Nombre del puesto
// Ubicación 
// Años minimos de experiencia
// Descipción del puesto
  const MAX_DESCRIPTION_CLIENT = 2000;
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    department: '',
    location: '',
    experience: 0,
    description: '',
    recruiterID: recruiterID
  });
  const output: Partial<Job> = {
    title: formData.title,
    company: formData.company,
    department: formData.department,
    location: formData.location,
    experience: formData.experience || 0,
    description: formData.description,
    job_type: undefined,
    salary: { min: 0, max: 0 },
    createdAt: new Date().toISOString(),
    status: 'active' as const
  };

  const [selectedView, setSelectedView] = useState<'applications' | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobPosted, setJobPosted] = useState(false);



  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => {
      const arr = prev[field as keyof typeof prev];
      if (Array.isArray(arr)) {
        return {
          ...prev,
          [field]: arr.map((item, i) => i === index ? value : item)
        };
      }
      return prev;
    });
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => {
      const arr = prev[field as keyof typeof prev];
      if (Array.isArray(arr)) {
        return { ...prev, [field]: [...arr, ''] };
      }
      return prev;
    });
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => {
      const arr = prev[field as keyof typeof prev];
      if (Array.isArray(arr)) {
        return {
          ...prev,
          [field]: arr.filter((_: any, i: number) => i !== index)
        };
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();    

    if (!validInformation()) return;

    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      if (payload.description && payload.description.length > MAX_DESCRIPTION_CLIENT) {
        payload.description = payload.description.slice(0, MAX_DESCRIPTION_CLIENT - 3) + '...';
      }

      console.log('Submitting form data:', payload);

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (response.ok) {
        setJobPosted(true);
        setSelectedJobId(String(result.id || result.insertId || ''));
      } else {
        console.error('Failed to create job:', result);
        alert(`Failed to create job: ${result.error || result.message || 'Unknown error'}`);
      }
    } catch (err) {
      const e = err as Error;
      console.error('Error submitting job:', e);
      alert(`Error creating job: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetDataForm = (): void => {

    // Reset the value
    setFormData({
      title: '',
      company: '',
      department: '',
      location: '',
      experience: 0,
      description: '',
      recruiterID: recruiterID
    });

  }


  const validInformation = () => {
    return (
      formData.title.trim() !== '' &&
      formData.company.trim() !== '' &&
      formData.department.trim() !== '' &&
      formData.location.trim() !== '' &&
      formData.experience !== 0 &&
      formData.description.trim() !== '' &&
      formData.description.length <= MAX_DESCRIPTION_CLIENT
    );
  };


  const handleBackToList = () => {
    setSelectedView(null);
    setSelectedJobId(null);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 2));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));


  if (selectedView === 'applications' && selectedJobId) {
    return <JobApplications recruiterID ={recruiterID} jobId={Number(selectedJobId)} onBack={handleBackToList} />;
  }


  if (jobPosted) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Posted Successfully! 🎉</h1>
            <p className="text-gray-600 mb-6">
              Your job posting for "{output.title}" is now live and visible to candidates.
            </p>
            
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => {
                  setJobPosted(false);
                  resetDataForm();
                  setCurrentStep(1);
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Post Another Job
              </button>
              <button 
                onClick={() => {
                  setJobPosted(false);
                  resetDataForm();
                  setSelectedView('applications');
                }}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                View Job Posting
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Briefcase className="w-8 h-8 text-blue-600 mr-3" />
            Post a New Job
          </h1>
          <p className="text-gray-600 mt-2">
            Create a job posting and let AI match the best candidates for you
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                <span className={`ml-2 font-medium ${
                  currentStep >= step ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {step === 1 ? 'Basic Info' : 'Review'}
                </span>
                {step < 2 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Job Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g. Senior Frontend Developer"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="e.g. TechCorp Inc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="e.g. Engineering"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5"
                    min="0"
                    max="50"
                    required
                  />
                  
                </div>   
              </div>

              <div className="mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={6}
                      placeholder="Describe the role, responsibilities, and what the candidate will be working on..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
              </div>
            </div>
          )}

          

          {/* Step 3: Review */}
          {currentStep === 2 && (
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Review & Publish</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{output.title}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  {/* <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {(output.job_type?.charAt(0).toUpperCase() + output.job_type?.slice(1)) || 'Full-time'}
                  </div> */}
                  {output.salary?.min && output.salary?.max && (
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      ${parseInt(String(output.salary.min)).toLocaleString()} - ${parseInt(String(output.salary.max)).toLocaleString()}
                    </div>
                  )}
                  {output.experience && (
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {String(output.experience).charAt(0).toUpperCase() + String(output.experience).slice(1)} Level
                    </div>
                  )}
                </div>
                <p className="text-gray-700 text-sm">{output.description}</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="px-8 py-6 bg-gray-50 rounded-b-xl flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex space-x-4">
              {currentStep < 2 ? (
                <button
                  type="button"
                  onClick={() => {
                    nextStep();
                    if (currentStep == 1)
                    {
                      // console.log("Sending data to your n8n workflow.");
                      // const result = sendData2N8N();
                      // console.log(result);
                    }
                  }}
                  disabled={
                    currentStep === 1 && !validInformation() 
                    // || (currentStep === 2 && !isStep2Valid())
                  }
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Publishing...
                    </>
                  ) : (
                    'Publish Job'
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
