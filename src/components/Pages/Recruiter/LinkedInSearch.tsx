import React, { useState } from 'react';
import { 
  Linkedin, 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Briefcase, 
  Users, 
  Mail, 
  MessageSquare,
  Plus,
  Eye,
  Download,
  ExternalLink,
  TrendingUp,
  Target,
  Clock
} from 'lucide-react';

import { LinkedInProfiles } from "../../../types";


const inMails = 3;

export default function LinkedInSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  // Mock LinkedIn profiles data
  const linkedinProfiles: LinkedInProfiles[] = [ ];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Open to opportunities':
        return 'bg-green-100 text-green-800';
      case 'Not actively looking':
        return 'bg-gray-100 text-gray-800';
      case 'Actively looking':
        return 'bg-blue-100 text-blue-800';
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

  const filteredProfiles = linkedinProfiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         profile.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         profile.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLocation = !locationFilter || profile.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesExperience = !experienceFilter || 
      (experienceFilter === 'junior' && profile.experience <= 3) ||
      (experienceFilter === 'mid' && profile.experience >= 3 && profile.experience <= 7) ||
      (experienceFilter === 'senior' && profile.experience > 7);
    const matchesIndustry = !industryFilter || profile.industry.toLowerCase().includes(industryFilter.toLowerCase());
    
    return matchesSearch && matchesLocation && matchesExperience && matchesIndustry;
  });

  if (selectedProfile) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setSelectedProfile(null)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              ← Back to Search Results
            </button>
            <h1 className="text-3xl font-bold text-gray-900">LinkedIn Profile</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                <div className="text-center mb-6">
                  <img
                    src={selectedProfile.avatar}
                    alt={selectedProfile.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h2 className="text-xl font-bold text-gray-900">{selectedProfile.name}</h2>
                  <p className="text-gray-600 text-sm mt-1">{selectedProfile.headline}</p>
                  <div className="flex items-center justify-center mt-3">
                    <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getMatchScoreColor(selectedProfile.matchScore)}`}>
                      <Star className="w-4 h-4 inline mr-1" />
                      {selectedProfile.matchScore}% match
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3" />
                    <span className="text-sm">{selectedProfile.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="w-5 h-5 mr-3" />
                    <span className="text-sm">{selectedProfile.experience} years experience</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-3" />
                    <span className="text-sm">{selectedProfile.connections} connections</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-3" />
                    <span className={`text-sm px-2 py-1 rounded-full ${getAvailabilityColor(selectedProfile.availability)}`}>
                      {selectedProfile.availability}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Top Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.skills.slice(0, 6).map((skill: string, index: number) => (
                      <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Education</h3>
                  <p className="text-sm text-gray-600">{selectedProfile.education}</p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <Users className="w-4 h-4 inline mr-1" />
                    {selectedProfile.mutualConnections} mutual connections
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Last active: {selectedProfile.lastActivity}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send InMail
                  </button>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Pipeline
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View LinkedIn Profile
                  </button>
                  <button className="w-full bg-purple-100 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors font-medium flex items-center justify-center">
                    <Download className="w-4 h-4 mr-2" />
                    Export Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Details & Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Professional Summary */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Summary</h3>
                <p className="text-gray-700 leading-relaxed">{selectedProfile.summary}</p>
              </div>

              {/* Work Experience */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Experience</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Current: {selectedProfile.currentCompany}</h4>
                      <p className="text-gray-600 text-sm">{selectedProfile.headline.split(' at ')[0]}</p>
                      <p className="text-gray-500 text-xs mt-1">Present</p>
                    </div>
                  </div>
                  {selectedProfile.previousCompanies.map((company: string, index: number) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-3 h-3 bg-gray-400 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{company}</h4>
                        <p className="text-gray-600 text-sm">Previous Role</p>
                        <p className="text-gray-500 text-xs mt-1">Past Experience</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent LinkedIn Activity</h3>
                <div className="space-y-4">
                  {selectedProfile.recentPosts.map((post: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 text-sm mb-2">{post.content}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {post.engagement} engagements
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Match Analysis */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 text-blue-600 mr-2" />
                  AI Match Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-green-700 mb-2">Strong Matches</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Experience level aligns with requirements</li>
                      <li>• Strong background in target industry</li>
                      <li>• Relevant skill set and expertise</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-amber-700 mb-2">Considerations</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Currently employed at competitor</li>
                      <li>• May require higher compensation</li>
                      <li>• Location preference to verify</li>
                    </ul>
                  </div>
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
                <Linkedin className="w-8 h-8 text-blue-600 mr-3" />
                LinkedIn Search
              </h1>
              <p className="text-gray-600 mt-2">
                Find and connect with top talent on LinkedIn
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                Saved Searches
              </button>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Advanced Search
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profiles Found</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{linkedinProfiles.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Match</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {linkedinProfiles.filter(p => p.matchScore >= 90).length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Star className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open to Work</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {linkedinProfiles.filter(p => p.availability === 'Open to opportunities').length}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">InMails Sent</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{inMails}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Mail className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, title, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <input
              type="text"
              placeholder="Location"
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
              <option value="mid">Mid (3-7 years)</option>
              <option value="senior">Senior (7+ years)</option>
            </select>
            <input
              type="text"
              placeholder="Industry"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Search Results ({filteredProfiles.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredProfiles.map((profile) => (
              <div key={profile.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(profile.availability)}`}>
                          {profile.availability}
                        </span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getMatchScoreColor(profile.matchScore)}`}>
                          {profile.matchScore}% match
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{profile.headline}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {profile.location}
                        </span>
                        <span className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {profile.experience} years
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {profile.connections} connections
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {profile.mutualConnections} mutual
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {profile.skills.slice(0, 5).map((skill, index) => (
                          <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                        {profile.skills.length > 5 && (
                          <span className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded">
                            +{profile.skills.length - 5}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Currently at {profile.company} • Last active {profile.lastActivity}
                      </p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedProfile(profile)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      InMail
                    </button>
                    <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium flex items-center">
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LinkedIn Integration Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">LinkedIn Premium Features</h3>
              <p className="text-gray-600 text-sm mt-1">
                Unlock advanced search filters, InMail credits, and detailed insights
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-sm font-medium">
                Learn More
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}