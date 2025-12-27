import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Mail, 
  Phone,
  DollarSign,
  Eye,
  MessageSquare,
  CheckCircle,
  Clock,
  TrendingUp,
  Plus,
  Award
} from 'lucide-react';

import useSWR from "swr";
import { Referral } from "../../../types";
import { useReferrals } from '../../../database';
import ReferCandidateWizard from '../Recruiter/ReferCandidateWizard'


interface ReferredCandidatesProps {
  recruiterID: number;
}

export default function ReferredCandidates({recruiterID} : ReferredCandidatesProps) {
  const [showReferCandidate, setShowReferCandidate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReferral, setSelectedReferral] = useState<any>(null);

  // Mock referral data

  const { referrals } = useReferrals();

  // const referrals: Referral[] = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'interview_scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'under_review':
        return 'Under Review';
      case 'interview_scheduled':
        return 'Interview Scheduled';
      case 'hired':
        return 'Hired';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredReferrals = referrals.filter(referral => {
    const matchesSearch = referral.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         referral.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         referral.referrer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || referral.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (showReferCandidate) {
    return <ReferCandidateWizard recruiterID={recruiterID} onBack={() => setShowReferCandidate(false)} />;
  }

  if (selectedReferral) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setSelectedReferral(null)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              ← Back to Referrals
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Referral Details</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Candidate Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                <div className="text-center mb-6">
                  <img
                    src={selectedReferral.candidate.avatar}
                    alt={selectedReferral.candidate.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h2 className="text-xl font-bold text-gray-900">{selectedReferral.candidate.name}</h2>
                  <p className="text-gray-600">{selectedReferral.candidate.currentRole}</p>
                  <p className="text-gray-500 text-sm">{selectedReferral.candidate.company}</p>
                  <div className="flex items-center justify-center mt-2">
                    <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getMatchScoreColor(selectedReferral.matchScore)}`}>
                      <Star className="w-4 h-4 inline mr-1" />
                      {selectedReferral.matchScore}% match
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-3" />
                    <span className="text-sm">{selectedReferral.candidate.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-3" />
                    <span className="text-sm">{selectedReferral.candidate.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3" />
                    <span className="text-sm">{selectedReferral.candidate.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="w-5 h-5 mr-3" />
                    <span className="text-sm">{selectedReferral.candidate.experience} years experience</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedReferral.candidate.skills.map((skill: string, index: number) => (
                      <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Referrer Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <UserPlus className="w-5 h-5 text-purple-600 mr-2" />
                  Referred By
                </h3>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{selectedReferral.referrer.name}</p>
                  <p className="text-sm text-gray-600">{selectedReferral.referrer.role}</p>
                  <p className="text-sm text-gray-600">{selectedReferral.referrer.company}</p>
                  <p className="text-sm text-gray-500">{selectedReferral.referrer.relationship}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-green-600">
                    <DollarSign className="w-5 h-5 mr-2" />
                    <span className="font-semibold">${selectedReferral.referralBonus.toLocaleString()} bonus</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Send Message
                  </button>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
                    Schedule Interview
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    View Full Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Timeline & Notes */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status & Job Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Position: {selectedReferral.jobTitle}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedReferral.status)}`}>
                    {getStatusLabel(selectedReferral.status)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  Referred on {new Date(selectedReferral.referredDate).toLocaleDateString()}
                </p>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Referrer Notes</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 text-sm leading-relaxed">{selectedReferral.notes}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Process Timeline</h3>
                <div className="space-y-4">
                  {selectedReferral.timeline.map((item: any, index: number) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`w-4 h-4 rounded-full mt-1 ${
                        item.status === 'completed' ? 'bg-green-500' :
                        item.status === 'in_progress' ? 'bg-blue-500' :
                        item.status === 'scheduled' ? 'bg-yellow-500' :
                        'bg-gray-300'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{item.event}</p>
                          <span className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 capitalize">{item.status.replace('_', ' ')}</p>
                      </div>
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

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <UserPlus className="w-8 h-8 text-blue-600 mr-3" />
                Referred Candidates
              </h1>
              <p className="text-gray-600 mt-2">
                Track and manage employee referrals and their progress
              </p>
            </div>
            <button 
              onClick={() => setShowReferCandidate(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Refer Candidate
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{referrals.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hired</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {referrals.filter(r => r.status === 'hired').length}
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
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {referrals.filter(r => ['under_review', 'interview_scheduled'].includes(r.status)).length}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bonus Paid</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ${referrals.filter(r => r.status === 'hired').reduce((sum, r) => sum + r.referralBonus, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
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
                  placeholder="Search referrals..."
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
                  <option value="under_review">Under Review</option>
                  <option value="interview_scheduled">Interview Scheduled</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Referrals List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Referrals ({filteredReferrals.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredReferrals.map((referral) => (
              <div key={referral.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img
                      src={referral.candidate.avatar}
                      alt={referral.candidate.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{referral.candidate.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(referral.status)}`}>
                          {getStatusLabel(referral.status)}
                        </span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getMatchScoreColor(referral.candidate.matchScore)}`}>
                          {referral.candidate.matchScore}% match
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {referral.candidate.professionalTitle} at {referral.candidate.company} → {referral.jobTitle}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <UserPlus className="w-4 h-4 mr-1" />
                          Referred by {referral.referrer.name}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(referral.referredDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ${referral.referralBonus.toLocaleString()} bonus
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {referral.candidate.skills.slice(0, 4).map((skill, index) => (
                          <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                        {referral.candidate.skills.length > 4 && (
                          <span className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded">
                            +{referral.candidate.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedReferral(referral)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
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