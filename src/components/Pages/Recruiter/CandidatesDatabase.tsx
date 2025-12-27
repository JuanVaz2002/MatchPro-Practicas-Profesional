import React, { useState } from 'react';
import CandidateRegistrationWizard from './CandidateRegistrationWizard';
import { 
  Users, 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Mail, 
  Phone,
  Download,
  MessageSquare,
  Eye,
  X,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  Wrench
} from 'lucide-react';
import { Application, Job } from '../../../types';
import { useApplications, useCandidatesDatabase, useAppliedJobsCandidate, useJobs, useJobsRecruiter } from '../../../database';
import EditCandidate from './EditCandidate';


interface CandidatesDatabaseProps {
  userID: number;
}


export default function CandidatesDatabase({ userID: recruiterID } : CandidatesDatabaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [selectedCandidateEdit, setSelectedCandidateEdit] = useState<any>(null);
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [assignCandidate, setAssignCandidate] = useState<any>(null);
  const [selectedJobId, setSelectedJobId] = useState<number | ''>('');

  let newCandidates = 0;
  const { candidatesDatabase: candidates } = useCandidatesDatabase(recruiterID)
  const { allApplications } = useApplications();
  const { candidateAppliedJobs } = useAppliedJobsCandidate(selectedCandidate?.id);
  const jobs = useJobsRecruiter(recruiterID);
  
 

  const getAvailability = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'Available';
      case 'available_soon':
        return 'Available Soon';
      case 'not_looking':
        return 'Not Looking';
      default:
        return 'Status Unknown';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'available_soon':
        return 'bg-yellow-100 text-yellow-800';
      case 'not_looking':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };



  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  

  const filteredCandidates = candidates.filter(candidate => {
    const candidateName = candidate.name || candidate.email || '';
    const candidateTitle = candidate.professionalTitle || '';
    const candidateLocation = candidate.location || '';
    
    const matchesSearch = candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          candidateTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          candidate.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) || false;
    const matchesSkill = !skillFilter || candidate.skills?.some(skill => 
      skill.toLowerCase().includes(skillFilter.toLowerCase())) || false;
    const matchesLocation = !locationFilter || candidateLocation.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesExperience = !experienceFilter || 
      (experienceFilter === 'junior' && candidate.experience <= 3) ||
      (experienceFilter === 'mid' && candidate.experience >= 3 && candidate.experience <= 6) ||
      (experienceFilter === 'senior' && candidate.experience > 6);
    
    return matchesSearch && matchesSkill && matchesLocation && matchesExperience;
  });

  const handleAssignCandidate = async (jobID: number, candidateID: number) => {
    
    // Print both Job.id and Candidate.id as requested
    console.log('Job ID:', jobID);
    console.log('Candidate ID:', candidateID);
    
    // Find and log the selected job details
    const selectedJob = jobs.find(job => job.id === jobID);
    if (selectedJob) {
      console.log('Selected Job Details:', {
        id: selectedJob.id,
        title: selectedJob.title,
        company: selectedJob.company
      });
    }
    
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

    setAssignCandidate(null);
    setSelectedJobId('');
  };


  const handleDownloadResume = async (candidate: any) => {
    try {      
      console.log('Attempting to download resume for candidate:', candidate);
      console.log('Candidate AI analysis:', candidate.aiAnalysis);
      
      // Check if candidate has AI analysis
      if (!candidate.aiAnalysis) {
        alert('No AI analysis found for this candidate. Resume may not be available.');
        return;
      }

      // Get the CV link from the candidate's AI analysis
      const cvLink = candidate.aiAnalysis.resume?.cv_link;
      console.log('CV Link found:', cvLink);

      if (!cvLink || cvLink.trim() === '') {
        alert('No resume file available for download. The candidate may not have uploaded a resume yet.');
        return;
      }

      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = cvLink;
      link.download = `${candidate.email.replace(/\s+/g, '_')}_resume.pdf`;
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




  if (showAddCandidate) {
    return <CandidateRegistrationWizard recruiterID={recruiterID} onBack={() => setShowAddCandidate(false)} />;
  }

  if (selectedCandidate) {

    const uniqueEducation = selectedCandidate.education.filter(
      (edu: any, index: number, self: any[]) =>
        index === self.findIndex(e =>
          e.degree === edu.degree &&
          e.school === edu.school &&
          e.year === edu.year &&
          e.gpa === edu.gpa
        )
    );

    console.log(selectedCandidate.workExperience);

    const uniqueWorkExperience = selectedCandidate.workExperience.filter(
      (wor: any, index: number, self: any[]) =>
        index === self.findIndex(w =>
          w.title === wor.title &&
          w.company === wor.company &&
          w.location === wor.location &&
          w.startDate === wor.startDate &&
          w.endDate === wor.endDate &&
          w.description === wor.description
        )
    );


    if(selectedCandidateEdit) {

      return <EditCandidate candidateId={selectedCandidate.id} onBack={() => {
        setSelectedCandidate(false);
        setSelectedCandidateEdit(false);
      }}/>
    }

    else
    {
      return (
        <div className="flex-1 p-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
              >
                ← Back to Candidates
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Candidate Profile</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Candidate Info */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                  <div className="text-center mb-6">
                    <img
                      src={selectedCandidate.avatar}
                      alt={selectedCandidate.name || selectedCandidate.email}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h2 className="text-xl font-bold text-gray-900">{selectedCandidate.name || selectedCandidate.email}</h2>
                    <p className="text-gray-600">{selectedCandidate.currentRole}</p>
                    <p className="text-gray-500 text-sm">{selectedCandidate.company}</p>
                    <div className="flex items-center justify-center mt-2">
                      <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getMatchScoreColor(selectedCandidate.matchScore)}`}>
                        <Star className="w-4 h-4 inline mr-1" />
                        {selectedCandidate.matchScore}% match
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-5 h-5 mr-3" />
                      <span className="text-sm">{selectedCandidate.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-5 h-5 mr-3" />
                      <span className="text-sm">{selectedCandidate.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-3" />
                      <span className="text-sm">{selectedCandidate.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Briefcase className="w-5 h-5 mr-3" />
                      <span className="text-sm">{selectedCandidate.experience} years experience</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-3" />
                      <span className={`text-sm px-2 py-1 rounded-full ${getAvailabilityColor(selectedCandidate.availability)}`}>
                        {selectedCandidate.availability}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.skills.map((skill: string, index: number) => (
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
                        <div className="font-medium text-gray-800">{edu.degree}</div>
                        <div>{edu.school} — {edu.year} • GPA: {edu.gpa}</div>
                      </div>
                    ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Salary Expectation</h3>
                    <p className="text-sm text-gray-600">
                      ${selectedCandidate.jobPreferences.salary.min.toLocaleString()} - ${selectedCandidate.jobPreferences.salary.max.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => handleDownloadResume(selectedCandidate)}
                      className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Resume
                    </button>
          
                  </div>
                </div>
              </div>

              {/* TODO - Details & History */}
              <div className="lg:col-span-2 space-y-6">
                {/* TODO - Summary */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Summary</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedCandidate.bio}</p>
                </div>

                {/* TODO - Work History */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Work History</h3>
                  <div className="space-y-4">
                    {uniqueWorkExperience.map((job: any, index: number) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{job.title}</h4>
                          <p className="text-gray-600 text-sm">{job.company}</p>
                          <p className="text-gray-500 text-xs mt-1">{job.location}</p>
                          <p className="text-gray-600 text-s">{job.startDate} - {job.endDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TODO - Activity Stats */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Application List</h3>
                  <div className="space-y-4">
                      {candidateAppliedJobs.map((job: Job, index: number) => (
                        <div key={index} className="text-sm text-gray-600">
                          <p><strong>Job #{job.id}: {job.title}</strong></p>
                          <p>Applied at {allApplications.find(app => app.jobId === job.id)?.appliedAt.split("T")[0]}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                Candidates Database
              </h1>
              <p className="text-gray-600 mt-2">
                Search and manage your candidate pool
              </p>
            </div>
            <button 
              onClick={() => setShowAddCandidate(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Candidate
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{candidates.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {candidates.filter(c => c.availability === 'Available').length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Match</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {candidates.filter(c => c.matchScore >= 90).length}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New This Week</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{newCandidates}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <input
              type="text"
              placeholder="Filter by skills"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Filter by location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Experience</option>
              <option value="junior">Junior (0-3 years)</option>
              <option value="mid">Mid (3-6 years)</option>
              <option value="senior">Senior (6+ years)</option>
            </select>
          </div>
        </div>



         {/* Assign to Job */}
         {assignCandidate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add Candidate</h3>
                <button
                  onClick={() => {
                    setAssignCandidate(null);
                    setSelectedJobId('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 text-sm mb-2">Adding:</p>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={assignCandidate.avatar}
                      alt={assignCandidate.name || assignCandidate.email}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  <div>
                    <p className="font-medium text-gray-900">{assignCandidate.name || assignCandidate.email}</p>
                    <p className="text-gray-600 text-sm">{assignCandidate.professionalTitle}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job
                  </label>
                  <select 
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={jobs.length === 0}
                  >
                    <option value="">{jobs.length === 0 ? 'Loading jobs...' : 'Select a job opening'}</option>
                    {jobs.length === 0 ? (
                      <option value="" disabled>No jobs available</option>
                    ) : (
                      jobs.filter(job => !allApplications.some(app => job.id === app.jobId && app.candidateId === assignCandidate.id)).map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.title} - {job.company}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    if (selectedJobId && assignCandidate) {
                      handleAssignCandidate(selectedJobId, assignCandidate.id);
                      setAssignCandidate(null);
                      setSelectedJobId('');
                    }
                  }}
                  disabled={!selectedJobId}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Assign Candidate
                </button>
                <button
                  onClick={() => {
                    setAssignCandidate(null);
                    setSelectedJobId('');
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}





        {/* Candidates List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Candidates ({filteredCandidates.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredCandidates.map((candidate) => (
              <div key={candidate.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img
                      src={candidate.avatar}
                      alt={candidate.name || candidate.email}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{candidate.name || candidate.email}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(candidate.availability)}`}>
                          {getAvailability(candidate.availability)}
                        </span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getMatchScoreColor(candidate.matchScore)}`}>
                          {candidate.matchScore}% match
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{candidate.professionalTitle} at {candidate.company}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {candidate.location}
                        </span>
                        <span className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {candidate.experience} years
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Last active {new Date(candidate.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {candidate.skills.slice(0, 5).map((skill, index) => (
                          <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 5 && (
                          <span className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded">
                            +{candidate.skills.length - 5}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Salary Expectation: ${candidate.jobPreferences.salary.min.toLocaleString()} - ${candidate.jobPreferences.salary.max.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    
                  <button
                      onClick={() => {setAssignCandidate(candidate)}}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center"
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      Assign to Job
                    </button>
                    <button
                      onClick={() => {setSelectedCandidate(candidate)}}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setSelectedCandidateEdit(candidate);
                      }}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center"
                    >
                      <Wrench className="w-4 h-4 mr-2" />
                      Edit
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}