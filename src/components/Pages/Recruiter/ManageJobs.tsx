import { useState } from 'react';

import { 
  Briefcase, 
  Users, 
  Eye, 
  Edit, 
  Pause, 
  Play, 
  Trash2, 
  Plus,
  Filter,
  Search,
  Calendar,
  MapPin,
  DollarSign,
  Clock
} from 'lucide-react';
import JobApplications from './JobApplications';
import EditJob from './EditJob';
import PostJob  from './PostJob'

import { useJobsRecruiter, useApplications } from '../../../database';

interface ManageJobsProps {
  userID: number;
}


// const { applications } = useApplications();

export default function ManageJobs({ userID: recruiterID }: ManageJobsProps) {
  const [selectedView, setSelectedView] = useState<'list' | 'applications' | 'edit'>('list');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock jobs data
  const { allApplications } = useApplications();
  const  jobs  = useJobsRecruiter(recruiterID);
  // if (isLoading) return <p className="text-center text-gray-500">Loading jobs...</p>;
  // if (error) return <p className="text-center text-red-500">Failed to load jobs.</p>;

  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'paused':
        return 'Paused';
      case 'closed':
        return 'Closed';
      default:
        return status;
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getAmmountOfApplicants = (jobId: string) => {
    const ammount = allApplications.filter(application => application.jobId === Number(jobId)).length
    return ammount;
  };

  const getAmmountOfHires = (jobId: string) => {
    const ammount = allApplications.filter(application => application.jobId === Number(jobId) && application.status === "hired").length
    return ammount;
  };

  const getAmmountOfRejects = (jobId: string) => {
    const ammount = allApplications.filter(application => application.jobId === Number(jobId) && application.status === "rejected").length
    return ammount;
  };

    

  const toggleJobStatus = (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    console.log(`Toggling job ${jobId} from ${currentStatus} to ${newStatus}`);


    const formData = {
      jobId: jobId,
      status: newStatus
    };

    try {      
      fetch('/api/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      // await mutateApplication(); 
    } catch (error) {
      console.error('Error updating status:', error);
      alert(`Error updating status: ${error.message}`);
    } finally {
      setTimeout(() => { }, 2000);
    }

    // In a real app, this would make an API call
  };

  const deleteJob = (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      console.log(`Deleting job ${jobId}`);
      // In a real app, this would make an API call
    }
  };

  const viewApplications = (jobId: string) => {
    setSelectedJobId(jobId);
    
    setSelectedView('applications');
  };

  const editJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setSelectedView('edit');
  };

  const handleBackToList = () => {
    setSelectedView('list');
    setSelectedJobId(null);
  };

  const handleSaveJob = (jobData: any) => {
    console.log('Saving job:', jobData);
    // In a real app, this would make an API call
    setSelectedView('list');
    setSelectedJobId(null);
  };

  const postNewJob = () => {
    return <PostJob userID={recruiterID}/>
  };

  if (selectedView === 'applications' && selectedJobId) {
    return <JobApplications recruiterID ={recruiterID} jobId={Number(selectedJobId)} onBack={handleBackToList} />;
  }

  if (selectedView === 'edit' && selectedJobId) {
    return <EditJob jobId={selectedJobId} recruiterID={recruiterID} onBack={handleBackToList} onSave={handleSaveJob} />;
  }

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Briefcase className="w-8 h-8 text-blue-600 mr-3" />
                Manage Jobs
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your job postings and track applications
              </p>
            </div>
            {/* <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                    onClick={() => postNewJob()}>
              
              <Plus className="w-5 h-5 mr-2" />
              
              Post New Job
            </button> */}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{jobs.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {jobs.filter(job => job.status === 'active').length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Play className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {allApplications.length}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {jobs.reduce((sum, job) => sum + job.views, 0)}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                <option>Newest</option>
                <option>Most Applications</option>
                <option>Most Views</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Job Postings ({filteredJobs.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredJobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {getStatusLabel(job.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{job.department}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-0" />
                        {job.salary.min} -
                        <DollarSign className="w-4 h-4 mr-0" />
                        {job.salary.max}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.job_type}
                      </span>
                      {/* <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {job.postedDays} days ago
                      </span> */}
                    </div>
                    
                    {/* Job Stats */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-sm text-blue-600 font-medium">Applications</div>
                        <div className="text-xl font-bold text-blue-900">{getAmmountOfApplicants(String(job.id))}</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="text-sm text-green-600 font-medium">Views</div>
                        <div className="text-xl font-bold text-green-900">{job.views}</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="text-sm text-red-600 font-medium">Rejected</div>
                        <div className="text-xl font-bold text-red-900">{getAmmountOfRejects(String(job.id))}</div>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-3">
                        <div className="text-sm text-green-600 font-medium">Hired</div>
                        <div className="text-xl font-bold text-green-900">{getAmmountOfHires(String(job.id))}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-6">
                    <button
                      onClick={() => viewApplications((job.id).toString())}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      View Applications
                    </button>
                    <button
                      onClick={() => editJob((job.id).toString())}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => toggleJobStatus((job.id).toString(), job.status)}
                      className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center ${
                        job.status === 'active'
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {job.status === 'active' ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Activate
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => deleteJob((job.id).toString())}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
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
