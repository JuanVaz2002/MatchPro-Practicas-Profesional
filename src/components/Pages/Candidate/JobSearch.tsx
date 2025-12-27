import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Clock, Bookmark, ExternalLink, Star, CheckCircle } from 'lucide-react';
import { useJobs, useJobsCandidate } from '../../../database';
import JobDetails from './JobDetails';
import JobApplicationForm from './JobApplicationForm';
import { Candidate } from '../../../types';

interface JobSearchProps {
  setActiveTab: (tab: string) => void;
  user: Candidate;
}

export default function JobSearch({ setActiveTab, user: candidate }: JobSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  

  // const jobs = useJobs();

  // const activeJobs = jobs.filter((job) => job.status === "active");

  const activeJobs = useJobsCandidate(candidate.id);

  // Helper to parse salary values that may be numbers or strings like "100k" or "$120k"
  const parseSalary = (val: any) => {
    if (val == null) return NaN;
    if (typeof val === 'number') return val;
    const s = String(val).toLowerCase().trim();
    // remove dollar signs, commas and spaces
    const cleaned = s.replace(/[$,\s]/g, '');
    // if contains 'k' treat as thousands
    if (cleaned.includes('k')) {
      const n = parseFloat(cleaned.replace('k', ''));
      return Number.isNaN(n) ? NaN : Math.round(n * 1000);
    }
    const n = parseFloat(cleaned.replace(/[^0-9.\-]/g, ''));
    return Number.isNaN(n) ? NaN : n;
  };

  const salaryRanges: Record<string, [number, number]> = {
    '0-50k': [0, 50000],
    '50k-100k': [50000, 100000],
    '100k-150k': [100000, 150000],
    '150k+': [150000, Infinity],
  };

  // Apply filters (search, location, salary) to the jobs
  const filteredJobs = (activeJobs || []).filter((job) => {
    // search filter (title, company, description)
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const inTitle = String(job.title || '').toLowerCase().includes(q);
      const inCompany = String(job.company || '').toLowerCase().includes(q);
      const inDesc = String(job.description || '').toLowerCase().includes(q);
      if (!inTitle && !inCompany && !inDesc) return false;
    }

    // location filter
    if (locationFilter.trim()) {
      const loc = String(job.location || '').toLowerCase();
      if (!loc.includes(locationFilter.trim().toLowerCase())) return false;
    }

    // salary filter
    if (salaryFilter) {
      const range = salaryRanges[salaryFilter];
      if (range) {
        const [minF, maxF] = range;
        const jobMin = parseSalary(job.salary?.min);
        const jobMax = parseSalary(job.salary?.max);
        const jMin = Number.isNaN(jobMin) ? jobMax : jobMin;
        const jMax = Number.isNaN(jobMax) ? jobMin : jobMax;
        // if both are NaN, skip this job
        if (Number.isNaN(jMin) && Number.isNaN(jMax)) return false;
        const realMin = Number.isNaN(jMin) ? -Infinity : jMin;
        const realMax = Number.isNaN(jMax) ? Infinity : jMax;
        // check overlap between job range and filter range
        if (realMax < minF || realMin > maxF) return false;
      }
    }

    return true;
  });

  // if (isLoading) return <p className="text-center text-gray-500">Loading jobs...</p>;
  // if (error) return <p className="text-center text-red-500">Failed to load jobs.</p>;


  const AddOneMoreView = async (jobId: string) => {
    const job = activeJobs.find((j) => j.id === Number(jobId)) ;
    let view: number = job?.views ?? 0;
    view += 1;

    const formData = {
      jobId: Number(jobId),
      view: view
    };

    try {
      console.log(`Updating an amount of views of ${job?.title} in MySQL:`, formData);
      
      const response = await fetch('/api/addView', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok) {
        // setJobPosted(true);
        console.log("Views updated successfully:", result);
      } else {
        console.error('Failed to update view:', result);
        alert(`Failed to update view: ${result.error || result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating view:', error);
      alert(`Error updating view: ${error.message}`);
    } finally {
      setTimeout(() => {
        // setIsSubmitting(false);
      }, 2000);
    }

  };

  const viewJobDetails = (jobId: string) => {
    AddOneMoreView(jobId);
    setSelectedJobId(jobId);
  };

  const applyJob = (jobId: string) => {
    setApplyingJobId(jobId);
  };

  const handleBackToSearch = () => {
    setSelectedJobId(null);
  };

  const handleNavigateToDashboard = () => {
    setActiveTab("home");
  };

  const handleBackFromApplication = () => {
    setSelectedJobId(applyingJobId);
    setApplyingJobId(null);
    // setExitToJobDetail(true);
    
  };

  const handleApplicationSubmit = () => {
    setApplyingJobId(null);
    setShowSuccessMessage(true);
    // Hide success message after 5 seconds
    setTimeout(() => setShowSuccessMessage(false), 5000);
    console.log('Application submitted successfully');
  };

  if (selectedJobId) {
    return <JobDetails jobId={selectedJobId} selectedCandidate={candidate} onBack={handleBackToSearch} onNavigateToDashboard={handleNavigateToDashboard} />;
  }

  if (applyingJobId) {
    const selectedJob = activeJobs.find(job => job.id === Number(applyingJobId))
    if (!selectedJob) {
      return <p className="text-center text-red-500">Job not found.</p>;
    }
    return (
      <JobApplicationForm job={{
          id: String(selectedJob.id),
          title: selectedJob.title,
          company: selectedJob.company,
          location: selectedJob.location,
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
      <div className="max-w-7xl mx-auto">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                Application submitted successfully! You'll receive a confirmation email shortly.
              </span>
            </div>
          </div>
        )}
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Job</h1>
          <p className="text-gray-600 mt-2">
            Discover opportunities matched to your skills and preferences
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <select
                value={salaryFilter}
                onChange={(e) => setSalaryFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Salary Range</option>
                <option value="0-50k">$0 - $50k</option>
                <option value="50k-100k">$50k - $100k</option>
                <option value="100k-150k">$100k - $150k</option>
                <option value="150k+">$150k+</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex space-x-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Search Jobs
            </button>
            <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium">
              Clear Filters
            </button>
          </div>
        </div>

        {/* Job Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Showing {filteredJobs.length} jobs matching your profile
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                <option>Best Match</option>
                <option>Newest</option>
                <option>Salary</option>
              </select>
            </div>
          </div>

          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600">{job.company}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                        {/* {job.remote && <span className="ml-1 text-green-600">• Remote</span>} */}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {job.salary.min} -
                        <DollarSign className="w-4 h-4 mr-1" />
                        {job.salary.max} 
                      </span>
                      
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.job_type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {/* <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getMatchScoreColor(job.matchScore)}`}> */}
                    {/* <Star className="w-4 h-4 inline mr-1" /> */}
                    {/* {job.matchScore}% match */}
                  {/* </span> */}
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{job.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Requirements</h4>
                  <ul className="space-y-1">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Benefits</h4>
                  <ul className="space-y-1">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Match Reasons</h4>
                  <div className="space-y-1">
                    <span className="inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded mr-1">
                      ✓ Skills match
                    </span>
                    <span className="inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded mr-1">
                      ✓ Experience level
                    </span>
                    <span className="inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
                      ✓ Location preference
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={() => {
                    AddOneMoreView(String(job.id))
                    applyJob(String(job.id))
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Apply Now
                </button>
                {/* <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"> */}
                <button 
                  onClick={() => viewJobDetails(String(job.id))}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  View Details
                </button>
                {/* </button> */}
                
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="bg-white text-gray-700 px-8 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium">
            Load More Jobs
          </button>
        </div>
      </div>
    </div>
  );
}