import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Recruiter } from '../../../types';
import {
  TrendingUp,
  Users,
  Briefcase,
  Eye,
  Clock,
  CheckCircle,
  Star,
  AlertCircle
} from 'lucide-react';

import { Candidate } from "../../../types";
import { useJobsRecruiter } from '../../../database';

import JobApplications from './JobApplications';
import EditJob from './EditJob';


let interviews = "+0";
let hires = "+0";
let applications = "+0";

let weekly_hiring_analytics = "↗ 0%";

interface RecruiterDashboardProps {
  recruiterID: number;
}


export default function RecruiterDashboard({recruiterID}: RecruiterDashboardProps) {

  const [selectedView, setSelectedView] = useState<'applications' | 'edit' | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const { user } = useAuth();
  const jobs = useJobsRecruiter(recruiterID);
  const activeJobs = jobs.filter((job) => job.status === "active");
  // if (isLoading) return <p className="text-center text-gray-500">Loading jobs...</p>;
  // if (error) return <p className="text-center text-red-500">Failed to load jobs.</p>;

  const recruiter = user as Recruiter;

  const stats = [
    {
      label: 'Active Jobs',
      value: activeJobs.length,
      change: '+0 this month',
      changeType: 'positive' as const,
      icon: Briefcase
    },
    {
      label: 'Total Applications',
      value: '0',
      change: '+0 this week',
      changeType: 'positive' as const,
      icon: Users
    },
    {
      label: 'Profile Views',
      value: '0',
      change: '0% this month',
      changeType: 'positive' as const,
      icon: Eye
    },
    {
      label: 'Hire Rate',
      value: '0%',
      change: '0% this month',
      changeType: 'positive' as const,
      icon: CheckCircle
    }
  ];

  const topCandidates: Candidate[] = [ ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
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

  const handleBackToList = () => {
    setSelectedView(null);
    setSelectedJobId(null);
  };

  const handleSaveJob = (jobData: any) => {
    console.log('Saving job:', jobData);
    // In a real app, this would make an API call
    setSelectedView(null);
    setSelectedJobId(null);
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
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {recruiter.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            {recruiter.company} • Hiring Dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Jobs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Active Job Postings</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {activeJobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{job.title}</h3>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {job.applicants} applications
                            </span>
                            {/* <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {job.views} views
                            </span> */}
                            {/* <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {job.postedDays} days ago
                            </span> */}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {/* <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(job.urgency)}`}>
                            {job.urgency} Priority
                          </span> */}
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                            {job.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          onClick={() => {
                            setSelectedJobId(String(job.id))
                            setSelectedView("applications")

                          }}>
                          View Applications
                        </button>
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        onClick={() => {
                          setSelectedJobId(String(job.id))
                          setSelectedView("edit")

                        }}>
                          Edit Job
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Candidates */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  Top Candidates
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {topCandidates.map((candidate) => (
                    <div key={candidate.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <img
                          src={candidate.avatar}
                          alt={candidate.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 text-sm">{candidate.name}</h3>
                            <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getMatchScoreColor(candidate.matchScore)}`}>
                              {candidate.matchScore}%
                            </span>
                          </div>
                          <p className="text-gray-600 text-xs">{candidate.role}</p>
                          <p className="text-gray-500 text-xs">{candidate.experience}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {candidate.skills.slice(0, 2).map((skill, index) => (
                              <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                                {skill}
                              </span>
                            ))}
                            {candidate.skills.length > 2 && (
                              <span className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded">
                                +{candidate.skills.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium">
                          View Profile
                        </button>
                        <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium">
                          Contact
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Weekly Hiring Analytics</h3>
              <p className="text-gray-600 text-sm mt-1">
                Your recruitment performance overview
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{weekly_hiring_analytics}</div>
              <div className="text-sm text-gray-600">vs last week</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-gray-600">Applications</div>
              <div className="text-xl font-semibold text-gray-900">{applications}</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-gray-600">Interviews</div>
              <div className="text-xl font-semibold text-gray-900">{interviews}</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-gray-600">Hires</div>
              <div className="text-xl font-semibold text-gray-900">{hires}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
