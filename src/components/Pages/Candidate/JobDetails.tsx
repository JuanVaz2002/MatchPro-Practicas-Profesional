import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  Building, 
  Calendar,
  Star,
  Bookmark,
  Share2,
  CheckCircle,
  AlertCircle,
  Briefcase,
  TrendingUp,
  Eye,
  Heart
} from 'lucide-react';
import JobApplicationForm from './JobApplicationForm';
import { useJobs, useJobsCandidate, useApplications } from '../../../database';
import { Candidate } from '../../../types';

interface JobDetailsProps {
  jobId: string;
  selectedCandidate: Candidate
  onBack: () => void;
  onNavigateToDashboard?: () => void;
}

export default function JobDetails({ jobId, selectedCandidate: candidate, onBack, onNavigateToDashboard }: JobDetailsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  
  const activeJobs = useJobsCandidate(candidate.id);
  const { allApplications } = useApplications();
  
  // Check if candidate has already applied for this job
  const hasApplied = allApplications.some(
    app => app.candidateId === candidate.id && app.jobId === Number(jobId)
  );
  
  // const { jobs, isLoading, error } = useJobs();
  // if (isLoading) return <p className="text-center text-gray-500">Loading jobs...</p>;
  // if (error) return <p className="text-center text-red-500">Failed to load jobs.</p>;

  // Find the specific job by converting jobId string to number
  const job = activeJobs.find(j => j.id === Number(jobId));
  
  if (!job) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Job Search
          </button>
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
            <p className="text-gray-600">The job you're looking for could not be found.</p>
          </div>
        </div>
      </div>
    );
  }
  // Mock data for UI properties not in Job interface
  const jobUI = {
    ...job,
    
    
    
  };

  const getExperienceLevel = (years: number) => {
    if (years <= 2) return 'Entry Level';
    if (years <= 5) return 'Mid Level';
    if (years >= 6) return 'Senior Level';
    return 'Lead/Manager';
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const handleApply = () => {
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = () => {
    // Application was submitted successfully
    setApplicationSubmitted(true);
    setShowApplicationForm(false);
    console.log('Application submitted successfully from JobDetails');
  };

  const handleBackFromApplication = () => {
    setShowApplicationForm(false);
  };

  const submitApplication = () => {
    // Simulate application submission
    setTimeout(() => {
      setApplicationSubmitted(true);
      setShowApplicationForm(false);
    }, 1500);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: `${jobUI.title} at ${jobUI.company}`,
        text: `Check out this job opportunity: ${jobUI.title} at ${jobUI.company}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Job link copied to clipboard!');
    }
  };

  if (applicationSubmitted) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted Successfully! 🎉</h1>
            <p className="text-gray-600 mb-6">
              Your application for "{jobUI.title}" at {jobUI.company} has been submitted. 
              You'll receive a confirmation email shortly.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-blue-800 text-sm space-y-1 text-left">
                <li>• Your application will be reviewed by the hiring team</li>
                <li>• You'll receive updates on your application status</li>
                <li>• If selected, you'll be contacted for an interview</li>
                <li>• You can track your application progress in your dashboard</li>
              </ul>
            </div>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={onBack}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Back to Job Search
              </button>
              <button 
                onClick={onNavigateToDashboard}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                View Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showApplicationForm) {
    return (
      <JobApplicationForm
        job={{
          id: String(job.id),
          title: job.title,
          company: job.company,
          location: job.location,
          candidate: candidate
          // matchScore: job.matchScore
        }}
        onBack={handleBackFromApplication}
        onSubmit={handleApplicationSubmit}
      />
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Job Search
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{jobUI.title}</h1>
                    <p className="text-xl text-gray-700 mb-3">{jobUI.company}</p>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {jobUI.location}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        ${jobUI.salary.min} - ${jobUI.salary.max}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleBookmark}
                    className={`p-3 rounded-lg transition-colors ${
                      isBookmarked 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isBookmarked ? <Heart className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={shareJob}
                    className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {jobUI.job_type}
                </span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {getExperienceLevel(jobUI.experience)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {jobUI.applicants} applicants
                  </span>
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {jobUI.views} views
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Posted {jobUI.createdAt}
                  </span>
                </div>
              </div>

              <button
                onClick={handleApply}
                disabled={hasApplied}
                className={`w-full py-4 px-6 rounded-lg transition-colors font-semibold text-lg ${
                  hasApplied 
                    ? 'bg-gray-300 text-gray-700 cursor-not-allowed opacity-60' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {hasApplied ? '✓ Already Applied' : 'Apply for this Position'}
              </button>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="prose prose-gray max-w-none">
                {jobUI.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Requirements & Responsibilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Requirements
                </h3>
                <ul className="space-y-3">
                  {jobUI.requirements.map((req, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
                  Responsibilities
                </h3>
                <ul className="space-y-3">
                  {jobUI.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits & Perks</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {jobUI.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start text-gray-700">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {jobUI.skills.map((skill, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="w-5 h-5 text-gray-600 mr-2" />
                About {jobUI.companyInfo.name}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Company Size</span>
                    <p className="font-medium text-gray-900">{jobUI.companyInfo.size}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Industry</span>
                    <p className="font-medium text-gray-900">{jobUI.companyInfo.industry}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Founded</span>
                    <p className="font-medium text-gray-900">{jobUI.companyInfo.founded}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Website</span>
                    <a href={jobUI.companyInfo.website} className="font-medium text-blue-600 hover:text-blue-700">
                      Visit Site
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed mb-3">{jobUI.companyInfo.description}</p>
                  <p className="text-gray-700 leading-relaxed">{jobUI.companyInfo.culture}</p>
                </div>
              </div>
            </div>
          </div>


          {/* Job Stats */}
          <div className="space-y-6">         
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Job Statistics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Applications</span>
                  <span className="font-medium text-gray-900">{jobUI.applicants}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Views</span>
                  <span className="font-medium text-gray-900">{jobUI.views}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}