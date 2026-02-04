import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, 
  Users, 
  Star, 
  Eye, 
  MessageSquare, 
  CheckCircle, 
  X, 
  Filter,
  Download,
  Calendar,
  Check,
  MapPin,
  DollarSign,
  Clock,
  Mail,
  Phone,
  User,
  Search,
  Loader2
} from 'lucide-react';
import { Application, Candidate, Job } from '../../../types';
import { useApplications, useCandidates, useJobsRecruiter, useAppliedJobsCandidate, useRejectedApplications } from '../../../database';



interface JobApplicationsProps {
  jobId: number;
  onBack: () => void;
  recruiterID: number
}

export default function JobApplications({ jobId, onBack, recruiterID }: JobApplicationsProps) {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [assignCandidate, setAssignCandidate] = useState<any>(false);
  const [rejectCandidate, setRejectCandidate] = useState<any>(false);
  const [updateStatus, setUpdateStatus] = useState<any>(false);
  const [status, setStatus] = useState<any>('');
  const [hireCandidate, setHireCandidate] = useState<any>(false);
  const [reasonRejection, setReasonRejection] = useState<string>('');
  const [rejectionComment, setRejectionComment] = useState('');
  const [rejectInJob, setRejectInJob] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { candidates: allCandidates } = useCandidates();
  const  job  = useJobsRecruiter(recruiterID).find(j => j.id === jobId);


  const { allApplications, mutateApplication } = useApplications();
  const { allRejectedApplications,  } = useRejectedApplications();
  const applications = allApplications.filter(application => application.jobId === Number(jobId));
 
  const applicants = allCandidates.filter(candidate => applications.some(application => candidate.id === application.candidateId));
  const restOfCanidates = allCandidates.filter(candidate => !applications.some(application => candidate.id === application.candidateId));
 
  const { candidateAppliedJobs } = useAppliedJobsCandidate(selectedApplication?.candidateId as number);

  const reasons = [
    'Busca mayores ingresos', 
    'Busca 100% nomina', 
    'Le interesan otros beneficios', 
    'Bajo nivel de ingles', 
    'Debajo del nivel tecnico esperado', 
    'Habilidades interpersonales',
    'Incompatible a la cultura',
    'Candidato no responde',
    'No desea moverse por ahora',
    'No se presento a la entrevista ',
    'Acepto otra oferta',
    'Contraoferta en su empleo actual',
    'Titulo equivocado'
  ];

  const definedReasons = [
    { value: '', label: 'Razones de rechazo' },
    ...reasons.map(reason => ({
      value: reason.trim(),
      label: reason.trim()
    }))
  ];

  const definedSteps = [
    ...(job?.steps ?? [])
    .filter(step => step?.trim() !== '')
    .map(step => {
      const trimmed = step.trim();
      const formattedValue = trimmed.toLowerCase().replace(/\s+/g, '_');
      return {
        value: formattedValue,
        label: trimmed
      };
    }),
  ];

  const allSteps = [
    { value: 'all', label: 'All Applications' },
    { value: 'pending', label: 'Pending Review' },
    
    ...definedSteps.map(step => 
      {
        return {
          value: step.value,
          label: step.label
        };
      }),
    { value: 'rejected', label: 'Rejected' },
    { value: 'hired', label: 'Hired' }
  ];

 


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'hired':
        return "Hired";
      case 'rejected':
        return 'Rejected';
      default:
        return definedSteps.find(step => step.value === status)?.label;
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredApplications = selectedStatus === 'all' 
    ? applications || []
    : (applications || []).filter(app => app.status === selectedStatus);

  const updateApplicationStatus = (applicationId: string, newStatus: string) => {
    // In a real app, this would make an API call
    console.log(`Updating application ${applicationId} to status: ${newStatus}`);
  };

  const handleDownloadResume = async (applicant: Candidate) => {
    try {
      // Get the CV link from the candidate's AI analysis resume data
      const cvLink: string = applicant.aiAnalysis?.resume?.cv_link;
      
      if (!cvLink) {
        alert('No resume available for download');
        return;
      }

      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = cvLink;
      link.download = `${(applicant.name || applicant.email || 'candidate').replace(/\s+/g, '_')}_resume.pdf`;
      link.target = '_blank';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download resume. Please try again.');
    }
  };


  const searchedApplicants = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      return restOfCanidates;
    }

    const query = searchQuery.toLowerCase();
    return restOfCanidates.filter(applicant => {
      const name = applicant.name?.toLowerCase() || '';
      return name.includes(query);
    });
  }, [restOfCanidates, searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowDropdown(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (value.trim().length >= 2) {
      setIsSearching(true);
      debounceTimerRef.current = setTimeout(() => {
        setIsSearching(false);
      }, 300);
    } else {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowDropdown(false);
    setSelectedApplication(null);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  // For Assign Candidate modal: allow selecting by candidateId without requiring an Application object
  const handleSelectCandidateById = (candidateId: number, candidateName: string) => {
    setSelectedApplication({ candidateId } as any);
    setSearchQuery(candidateName);
    setShowDropdown(false);
  };

  const highlightMatch = (text: string, query: string) => {
    const safeText = (text ?? '').toString();          // coerce null/undefined → ''
    if (!query.trim() || query.trim().length < 2) return safeText;
  
    const parts = safeText.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, idx) =>
          part.toLowerCase() === query.toLowerCase()
            ? <span key={idx} className="bg-yellow-200 font-semibold">{part}</span>
            : part
        )}
      </>
    );
  };

  const handleRejectionCommentChange = (value: string) => {
    if (value.length > 500) {
      return;
    }
    setRejectionComment(value);
  };

  const handleAssignCandidate = async (jobID: number, candidateID: number) => {
    
    // Print both Job.id and Candidate.id as requested
    console.log('Job ID:', jobID);
    console.log('Candidate ID:', candidateID);
    
    // Find and log the selected job details

    console.log('Selected Job Details:', {
      id: job?.id,
      title: job?.title,
      company: job?.company
    });
  
    
    const formData = {
      jobId: jobID,
      candidateId: candidateID
    };

    try {
      console.log('Saving application form data to MySQL:', formData);
      
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      await mutateApplication(); 
      const result_application = await response.json();
      console.log("API Response:", result_application);

      if (response.ok) {
        // setJobPosted(true);
        console.log("application saved successfully:", result_application);
      } else {
        console.error('Failed to save application:', result_application);
        alert(`Failed to save application: ${result_application.error || result_application.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving application:', error);
      alert(`Error saving application: ${error.message}`);
    } finally {
      setTimeout(() => {
        // setIsSubmitting(false);
      }, 2000);
    }

    setAssignCandidate(false);
    setSelectedApplication(null);
  };

  


  const handleRejectCandidate = async (jobID: number, applicant: Candidate) => {
    const candidateID: number = applicant.id;

    const formData = {
      jobId: jobID,
      candidateId: candidateID,
      status: "rejected",
      reason: null,
      comentario: null
    };

    try {      
      await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      await mutateApplication(); 
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert(`Error rejecting application: ${error.message}`);
    } finally {
      setTimeout(() => { }, 2000);
    }

    setRejectCandidate(false);
    setSelectedApplication(null)
    setRejectionComment('');
  };


  const handleHireCandidate = async (jobID: number, applicant: Candidate) => {
    const candidateID: number = applicant.id;
    
    const formData = {
      jobId: jobID,
      candidateId: candidateID,
      status: 'hired',
      reason: null,
      comentario: null
    };

    try {      
      await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      await mutateApplication(); 
    } catch (error) {
      console.error('Error hiring the candidate:', error);
      alert(`Error hiring the candidate: ${error.message}`);
    } finally {
      setTimeout(() => { }, 2000);
    }

    setHireCandidate(false);
    setSelectedApplication(null)
  };

  const handleReviewApplication = async (applicationId) => {
    const formData = {
      applicationId: applicationId
    };

    await fetch('/api/reviewApplication', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    mutateApplication();
  };


  const handleUpdateStatus = async (jobID: number, applicant: Candidate) => {
    const candidateID: number = applicant.id;
    
    const formData = {
      jobId: jobID,
      candidateId: candidateID,
      status: status,
      reason: null,
      comentario: null
    };


    try {      
      await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      await mutateApplication(); 
    } catch (error) {
      console.error('Error updating status:', error);
      alert(`Error updating status: ${error.message}`);
    } finally {
      setTimeout(() => { }, 2000);
    }

    setUpdateStatus(false);
    setStatus('');
    setSelectedApplication(null);
  };

  if (selectedApplication) {

    const selectedApplicant = applicants.find(applicant => applicant.id === selectedApplication.candidateId)

    if (selectedApplicant) {

      const uniqueEducation = Array.from(
        new Set(selectedApplicant.education.map((edu: any) => JSON.stringify(edu)))
      ).map((edu: string) => JSON.parse(edu));
      
      if(!selectedApplication.reviewed)
      {
        handleReviewApplication(selectedApplication.id);

      }
      
      return (
        <div className="flex-1 p-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setSelectedApplication(null)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Applications
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Candidate Profile</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Candidate Info */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                  <div className="text-center mb-6">
                    <img
                      src={selectedApplicant.avatar}
                      alt={selectedApplicant.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h2 className="text-xl font-bold text-gray-900">{selectedApplicant.name}</h2>
                    <p className="text-gray-600">{selectedApplicant.professionalTitle}</p>
                    <div className="flex items-center justify-center mt-2">
                      <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getMatchScoreColor(selectedApplicant.aiAnalysis?.matchScore || 0)}`}>
                        <Star className="w-4 h-4 inline mr-1" />
                        {selectedApplicant.aiAnalysis?.matchScore || 0}% match
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-5 h-5 mr-3" />
                      <span className="text-sm">{selectedApplicant.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-5 h-5 mr-3" />
                      <span className="text-sm">{selectedApplicant.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-3" />
                      <span className="text-sm">{selectedApplicant.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-3" />
                      <span className="text-sm">{selectedApplicant.experience} experience</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplicant.skills?.map((skill: string, index: number) => (
                        <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Education</h3>
                    <div className="space-y-2">
                      {uniqueEducation.map((edu: any, index: number) => (
                        <div key={index} className="text-sm text-gray-600">
                          <p><strong>{edu.degree}</strong>, {edu.school}</p>
                          <p>Year: {edu.year} | GPA: {edu.gpa}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
                  <div className="space-y-3">
            
                    <button 
                      onClick={() => handleDownloadResume(selectedApplicant)}
                      className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
                      >
                      <Download className="w-4 h-4 mr-2" />
                      Download Resume
                    </button>
                    <button 
                      onClick={() => setRejectCandidate(true)}
                      className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors font-medium">
                      Reject Application
                    </button>


                    <button 
                      onClick={() => setUpdateStatus(true)}
                      className="w-full bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors font-medium">
                      Update Status
                    </button>

                    <button 
                      onClick={() => handleHireCandidate(selectedApplication.jobId, selectedApplicant)}
                      className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-lg hover:bg-green-200 transition-colors font-medium">
                      Hire this Candidate
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Analysis and Application list */}
              <div className="lg:col-span-2 space-y-6">
                {/* AI Analysis */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Star className="w-5 h-5 text-purple-600 mr-2" />
                    AI Analysis
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-medium text-green-700 mb-3 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Strengths
                      </h4>
                      <ul className="space-y-2">
                        {selectedApplicant.aiAnalysis?.strengths?.map((strength: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-amber-700 mb-3 flex items-center">
                        <X className="w-4 h-4 mr-2" />
                        Areas of Concern
                      </h4>
                      <ul className="space-y-2">
                        {selectedApplicant.aiAnalysis?.concerns?.map((concern: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            {concern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <h4 className="font-medium text-blue-900 mb-2">AI Recommendation</h4>
                    <p className="text-blue-800 text-sm">{selectedApplicant.aiAnalysis?.recommendation || 'No recommendation available'}</p>
                  </div>
                </div>

                {/* Application list */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Application List</h3>
                  <div className="space-y-4">
                      {candidateAppliedJobs.map((job: Job, index: number) => {
                        const application = allApplications.find(app => app.jobId === job.id);
                        if (application) {
                          const rejectedApplication = allRejectedApplications.find(rej => rej.rejectedApplicationId === application.id);
                          return (
                            <div key={index} className="text-sm text-gray-600">
                              <p><strong>Job #{job.id}: {job.title}</strong></p>
                              <p>Applied at {application?.appliedAt.split("T")[0]}</p>
                              <p>Status: {getStatusLabel(application?.status)}</p>
                              {rejectedApplication?.reason && (
                                <p>Reason: {rejectedApplication.reason}</p>
                              )}
                            </div>
                          );
                        }
                      })}
                  </div>
                </div>
              </div>

              {/* Rejection */}
              {rejectCandidate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                    
                    <div className="flex items-center justify-between mb-4">
                      
                      <h3 className="text-lg font-semibold text-gray-900">Reject Application</h3>
                      <button
                        onClick={() => {
                          setRejectCandidate(false);
                          
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    


                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reason
                        </label>
                          <select
                            value={reasonRejection}
                            onChange={(e) => setReasonRejection(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {definedReasons.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job
                        </label>
                          <select
                            value={rejectInJob}
                            onChange={(e) => setRejectInJob(Number(e.target.value))}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {candidateAppliedJobs.map((job: Job) => (
                              <option key={job.id} value={job.id}>
                                {job.title}
                              </option>
                            ))}
                          </select>
        
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Comment
                        </label>
                          <textarea
                            ref={textareaRef}
                            value={rejectionComment}
                            onChange={(e) => handleRejectionCommentChange(e.target.value)}
                            placeholder="Provide additional details about the rejection (optional)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-y min-h-[120px] max-h-[300px]"
                            maxLength={500}
                            // disabled={isSubmittingRejection}
                            aria-label="Rejection comment"
                            aria-describedby="comment-counter comment-error"
                          />
                      </div>
                    </div>

                    <div className="flex space-x-3 mt-6">
                      <button
                        onClick={() => {
                          if (reasonRejection) {
                            handleRejectCandidate(rejectInJob, selectedApplicant);
                            setReasonRejection('');
                            setRejectInJob(0);
                          }
                        }}
                        disabled={!reasonRejection }
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Reject Application
                      </button>
                      <button
                        onClick={() => {
                          setRejectCandidate(false);
                          setRejectionComment('')
                        }}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}


              {/* Update Status */}
              {updateStatus && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                    
                    <div className="flex items-center justify-between mb-4">
                      
                      <h3 className="text-lg font-semibold text-gray-900">Update Status</h3>
                      <button
                        onClick={() => {
                          setUpdateStatus(false);
                          
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    


                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                          <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {definedSteps.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                      </div>
                    </div>

                    <div className="flex space-x-3 mt-6">
                      <button
                        onClick={() => {
                          if (status) {
                            handleUpdateStatus(jobId, selectedApplicant);
                          }
                        }}
                        disabled={!status }
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Update Current Status
                      </button>
                      <button
                        onClick={() => {
                          setUpdateStatus(false);
                        }}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
  }

  return (

    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Jobs
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job?.title}</h1>
              <p className="text-gray-600 mt-2">{job?.company} • {job?.location}</p>
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                <span className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {job?.salary.min} - {job?.salary.max}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {job?.job_type}
                </span>
            
              </div>
            </div>
            <div className="text-right">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                {job?.status}
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {job?.applicants} applications
                </div>
                <div className="flex items-center mt-1">
                  <Eye className="w-4 h-4 mr-1" />
                  {job?.views} views
                </div>
              </div>
            </div>
          </div>
        </div>
        

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{applications?.length || 0}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {(applications || []).filter(app => app.status === 'rejected').length}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <X className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hired</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {(applications || []).filter(app => app.status === 'hired').length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Match Score</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {applicants && applications.length > 0 
                    ? Math.round(applicants.reduce((sum, appli) => sum + (appli.aiAnalysis?.matchScore || 0), 0) / applications.length)
                    : 0}%
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
   
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                 {allSteps.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                <option>Match Score</option>
                <option>Application Date</option>
                <option>Name</option>
              </select>
            </div>
          </div>
        </div>


        <div className="mb-8">
          <div className="flex items-center justify-end">
            <button 
              onClick={() => setAssignCandidate(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
            >
              <User className="w-5 h-5 mr-2" />
              Assign Candidate
            </button>
          </div>
        </div>


        {/* Assign Candidate */}
        {assignCandidate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Assign Candidate</h3>
                <button
                  onClick={() => {
                    setAssignCandidate(false);
                    setSelectedApplication(null);
                    setSearchQuery('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Candidate
                  </label>
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onFocus={() => setShowDropdown(true)}
                        placeholder="Search by applicant's name..."
                        className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        // disabled={applicants.length === 0}
                        aria-label="Search Applicants"
                        aria-expanded={showDropdown}
                        aria-controls="candidate-dropdown"
                        aria-autocomplete="list"
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                        {isSearching && (
                          <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                        )}
                        {searchQuery && (
                          <button
                            onClick={handleClearSearch}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            aria-label="Clear search"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        )}
                      </div>
                    </div>

                    {showDropdown && searchQuery.trim().length >= 2 && (
                      <div
                        ref={dropdownRef}
                        id="candidate-dropdown"
                        role="listbox"
                        className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto"
                      >
                        {searchedApplicants.length === 0 ? (
                          <div className="p-4 text-center text-gray-500 text-sm">
                            <User className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            No candidates found matching "{searchQuery}"
                          </div>
                          ) : (
                          searchedApplicants.map((candidate) => (
                            <button
                              key={candidate.id}
                              role="option"
                              aria-selected={selectedApplication?.candidateId !== candidate.id}
                              onClick={() => handleSelectCandidateById(candidate.id, candidate.name)}
                              className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                                selectedApplication?.candidateId !== candidate.id ? 'bg-blue-50' : ''
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                  {candidate.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 truncate">
                                    {highlightMatch(candidate.name, searchQuery)}
                                  </p>
                                  <p className="text-sm text-gray-600 truncate">
                                    {highlightMatch(candidate.professionalTitle || "", searchQuery)}
                                  </p>
                                </div>
                                {selectedApplication?.candidateId === candidate.id && (
                                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                )}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}

                    {searchQuery.trim().length > 0 && searchQuery.trim().length < 2 && (
                      <p className="mt-2 text-xs text-gray-500">
                        Type at least 2 characters to search
                      </p>
                    )}

                    {applicants.length === 0 && (
                      <p className="mt-2 text-xs text-gray-500">
                        No applicants available
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    if (selectedApplication) {
                      handleAssignCandidate(jobId, selectedApplication?.candidateId as number);
                    }
                  }}
                  disabled={!selectedApplication}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Assign Candidate
                </button>
                <button
                  onClick={() => {
                    setAssignCandidate(false);
                    setSelectedApplication(null);
                    setSearchQuery('');
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Applications List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Applications ({filteredApplications.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredApplications.map((application, index) => {
              const applicant = applicants.find(app => app.id === application.candidateId);       
              if (applicant){
                return (
                <div key={`${applicant.id}-${index}`} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <img
                        src={applicant.avatar}
                        alt={applicant.name || applicant.email || 'Unknown Candidate'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{applicant.name || applicant.email || 'Unknown Candidate'}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {getStatusLabel(application.status)}
                          </span>
                          <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getMatchScoreColor(applicant.aiAnalysis?.matchScore || 0)}`}>
                            {applicant.aiAnalysis?.matchScore || 0}% match
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{applicant.professionalTitle}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {applicant.location}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {applicant.experience}
                          </span>
                          <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {applicant.skills?.slice(0, 4).map((skill, index) => (
                            <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                              {skill}
                            </span>
                          ))}
                          {applicant.skills && applicant.skills.length > 4 && (
                            <span className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded">
                              +{applicant.skills.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </button>
                      <button 
                        onClick={() => handleDownloadResume(applicant)}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download CV
                      </button>
                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </button>
                    </div>
                  </div>
                </div>
            )}})}
          </div>
        </div>
      </div>
    </div>
  );
}
