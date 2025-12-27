import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Candidate, Job } from '../../../types';
import {
  TrendingUp,
  Eye,
  MessageSquare,
  CheckCircle,
  Clock,
  Briefcase,
  Star,
  Target
} from 'lucide-react';

import { useRecentApplication } from '../../../database';

interface CandidateDashboardProps {
  candidateID: number;
}


export default function CandidateDashboard({candidateID}: CandidateDashboardProps) {
  const { user } = useAuth();
  const candidate = user as Candidate;


  const stats = [
    {
      label: 'Applications Sent',
      value: 0,
      change: '0 this week',
      changeType: 'positive' as const,
      icon: Briefcase
    },
    {
      label: 'Profile Views',
      value: 0,
      change: '0 this week',
      changeType: 'positive' as const,
      icon: Eye
    },
    {
      label: 'Interview Invites',
      value: 0,
      change: '0 this week',
      changeType: 'positive' as const,
      icon: MessageSquare
    },
    {
      label: 'Match Score Avg',
      value: '0%',
      change: '0% this month',
      changeType: 'positive' as const,
      icon: Target
    }
  ];

  const  recentApplications = useRecentApplication(candidateID);

  const jobRecommendations: Job[] = [ ];

  // const {jobs: jobRecommendations} = useJobs();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shortlisted':
        return 'bg-blue-100 text-blue-800';
      case 'Interview Scheduled':
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

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {candidate.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your recruitment activity overview
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
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
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
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentApplications ? (
                    <div key={recentApplications.candidateId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{candidate.professionalTitle}</h3>
                          <p className="text-gray-600 text-sm">{candidate.company}</p>
                          <p className="text-gray-500 text-xs mt-1">Applied {recentApplications.appliedAt}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(recentApplications.status)}`}>
                            {recentApplications.status}
                          </span>
                          <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getMatchScoreColor(candidate.aiAnalysis.matchScore)}`}>
                            {candidate.aiAnalysis.matchScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent applications found</p>
                  )
                  
                  
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Job Recommendations */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  Recommended Jobs
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {jobRecommendations.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm">{job.title}</h3>
                          <p className="text-gray-600 text-xs">{job.company}</p>
                          <p className="text-gray-500 text-xs">{job.location}</p>
                        </div>
                        {/* <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getMatchScoreColor(job.matchScore)}`}>
                          {job.matchScore}%
                        </span> */}
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-2">{job.salary.min}</p>
                      <div className="space-y-1">
                        {/* {job.reasons.map((reason, index) => (
                          <span key={index} className="inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded mr-1">
                            ✓ {reason}
                          </span>
                        ))} */}
                      </div>
                      <button className="w-full mt-3 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        Apply Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
