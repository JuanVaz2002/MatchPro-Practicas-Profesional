"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useCandidates, useRecruiters } from "../database"
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Phone,
  Calendar,
  Edit,
  Save,
  X,
  Settings as SettingsIcon,
  Bell,
  Shield,
  Building,
  FileText,
  ExternalLink,
} from "lucide-react"

import type { Candidate, Recruiter } from "../types"

interface ProfileData {
  // Common
  id: number;
  email: string;
  password?: string;
  name: string;
  avatar_url: string;
  createdAt?: string;
  bio?: string;
  location?: string;
  phone?: string;
  role: 'candidate' | 'recruiter';

  // Candidate-specific
  skills: string[];
  experience: number;
  cvUploaded?: boolean;
  professional_title?: string;
  matchScore?: number;
  availability?: string;
  recruitmentSource?: string;
  company?: string;
  industry?: string;
  // Candidate job preferences
  salary_min: number;
  salary_max: number;
  job_type: string;
  preferred_locations: string[];
  cv_link: string;

  // Recruiter-specific
  companyName?: string;
  companySizeMin?: number;
  companySizeMax?: number;
  address?: string;
  foundedYear?: number;
  companyDescription?: string;
  employerRole?: string;
  requirements?: string[];
  companyTypes?: string[];
  companyLocation?: string;
}


// Helper function to convert location string to array
function parseLocationToArray(location: string | string[]): string[] {
  if (!location) return [];
  if (Array.isArray(location)) return location;
  if (typeof location === 'string') {
    return location
      .split(',')
      .map(loc => loc.trim())
      .filter(loc => loc.length > 0);
  }
  return [];
}

export default function Settings() {
  const { user, setUser } = useAuth();
  const { mutateCandidates } = useCandidates();
  const { mutateRecruiters } = useRecruiters();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [emailError, setEmailError] = useState('');
  const [formData, setFormData] = useState<ProfileData>({
    // Common
    id: user?.id || 0,
    name: user?.name || '',
    email: user?.email || '',
    password: undefined,
    avatar_url: user?.avatar || '',
    createdAt: (user as any)?.createdAt || '',
    bio: user?.bio || '',
    location: (user as any)?.location || '',
    phone: (user as any)?.phone || '',
    role: user?.role === 'candidate' ? 'candidate' : 'recruiter',

    // Candidate defaults
    skills: (user as Candidate)?.skills || [],
    experience: (user as Candidate)?.experience || 0,
    cvUploaded: (user as Candidate)?.cvUploaded || false,
    professional_title: (user as Candidate)?.professionalTitle || '',
    matchScore: (user as Candidate)?.matchScore || 0,
    availability: (user as Candidate)?.availability || '',
    recruitmentSource: (user as Candidate)?.recruitmentSource || '',
    salary_min: (user as Candidate)?.jobPreferences?.salary?.min || 0,
    salary_max: (user as Candidate)?.jobPreferences?.salary?.max || 0,
    job_type: (user as Candidate)?.jobPreferences?.jobType || 'full-time',
    preferred_locations: parseLocationToArray((user as Candidate)?.jobPreferences?.location),
    cv_link: (user as Candidate)?.aiAnalysis?.resume?.cv_link || '',

    // Recruiter defaults
    company: (user as Recruiter)?.company || '',
    industry: (user as Recruiter)?.industry || '',
    companyName: (user as Recruiter)?.company || '',
    companySizeMax: (user as Recruiter)?.companySizeMax || 0,
    companySizeMin: (user as Recruiter)?.companySizeMin || 0,
    address: (user as Recruiter)?.address || '',
    foundedYear: (user as Recruiter)?.foundedYear || 0,
    companyDescription: (user as Recruiter)?.companyDescription || '',
    employerRole: (user as Recruiter)?.employerRole || '',
    requirements: (user as Recruiter)?.requirements || [],
    companyTypes: (user as Recruiter)?.companyTypes || [],
    companyLocation: (user as Recruiter)?.companyLocation || ''
  });


  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    // Fetch fresh profile data from API
    try {
      if (user?.role === 'candidate') {
        const response = await fetch(`/api/candidate?id=${user.id}`);
        if (response.ok) {
          const candidates = await response.json();
          const candidate = Array.isArray(candidates) ? candidates.find((c: any) => c.id === user.id) : candidates;
          if (candidate) {
            setFormData({
              id: candidate.id,
              name: candidate.name || '',
              email: candidate.email || '',
              avatar_url: candidate.avatar || '',
              createdAt: candidate.createdAt || '',
              bio: candidate.bio || '',
              location: candidate.location || '',
              phone: candidate.phone || '',
              role: 'candidate',
              skills: candidate.skills || [],
              experience: candidate.experience || 0,
              cvUploaded: candidate.cvUploaded || false,
              professional_title: candidate.professionalTitle,
              matchScore: candidate.matchScore || 0,
              availability: candidate.availability || '',
              recruitmentSource: candidate.recruitmentSource || '',
              company: candidate.company || '',
              industry: candidate.industry || '',
              salary_min: candidate.jobPreferences?.salary?.min || 0,
              salary_max: candidate.jobPreferences?.salary?.max || 0,
              job_type: candidate.jobPreferences?.jobType || 'full-time',
              preferred_locations: parseLocationToArray(candidate.jobPreferences?.location),
              cv_link: candidate.aiAnalysis?.resume?.cv_link || ''
            });
            return;
          }
        }
      } else if (user?.role === 'recruiter') {
        const response = await fetch(`/api/recruiters?id=${user.id}`);
        if (response.ok) {
          const recruiters = await response.json();
          const recruiter: Recruiter= Array.isArray(recruiters) ? recruiters.find((r: any) => r.id === user.id) : recruiters;
          if (recruiter) {
            setFormData({
              id: recruiter.id,
              name: recruiter.name || '',
              email: recruiter.email || '',
              avatar_url: recruiter.avatar || '',
              createdAt: recruiter.createdAt || '',
              bio: recruiter.bio || '',
              location: recruiter.location || '',
              phone: recruiter.phone || '',
              role: 'recruiter',
              skills: [],
              experience: 0,
              salary_min: 0,
              salary_max: 0,
              job_type: 'full-time',
              preferred_locations: [],
              company: recruiter.company || '',
              industry: recruiter.industry || '',
              companyName: recruiter.company || '',
              companySizeMin: recruiter.companySizeMin || 0,
              companySizeMax: recruiter.companySizeMax || 0,
              address: recruiter.address || '',
              foundedYear: recruiter.foundedYear || 0,
              companyDescription: recruiter.companyDescription || '',
              employerRole: recruiter.employerRole || '',
              requirements: recruiter.requirements || [],
              companyTypes: recruiter.companyTypes || [],
              companyLocation: recruiter.companyLocation || '',
              cv_link: ''
            });
            // setCompanySize({ 
            //   min: Number(formData.companySize?.split('-')[0]) || 0, 
            //   max: Number(formData.companySize?.split('-')[1]) || 0
            // });
            return;
          }
        }
      }
      // Fallback to context if API fetch fails
      console.warn('Could not fetch from API, using context data');
      loadProfileFromContext();
    } catch (error) {
      console.error('Error loading profile from API:', error);
      loadProfileFromContext();
    }
  };

  const loadProfileFromContext = () => {
    // Fallback: load from user context
    if (user?.role === 'candidate') {
      const candidate = user as Candidate;
      setFormData({
        id: candidate.id,
        name: candidate.name || '',
        email: candidate.email || '',
        avatar_url: candidate.avatar || '',
        createdAt: (candidate as any).createdAt || '',
        bio: candidate.bio || '',
        location: candidate.location || '',
        phone: candidate.phone || '',
        role: 'candidate',
        skills: candidate.skills || [],
        experience: candidate.experience || 0,
        cvUploaded: (candidate as any).cvUploaded || false,
        professional_title: candidate.professionalTitle,
        matchScore: (candidate as any).matchScore || 0,
        availability: (candidate as any).availability || '',
        recruitmentSource: (candidate as any).recruitmentSource || '',
        company: candidate.company || '',
        industry: candidate.industry || '',
        salary_min: candidate.jobPreferences?.salary?.min || 0,
        salary_max: candidate.jobPreferences?.salary?.max || 0,
        job_type: candidate.jobPreferences?.jobType || 'full-time',
        preferred_locations: parseLocationToArray(candidate.jobPreferences?.location),
        cv_link: (candidate as Candidate)?.aiAnalysis?.resume?.cv_link || ''
      });
    } else if (user?.role === 'recruiter') {
      const employer = user as Recruiter;
      setFormData({
        id: employer.id,
        name: employer.name || '',
        email: employer.email || '',
        avatar_url: employer.avatar || '',
        createdAt: (employer as any).createdAt || '',
        bio: employer.bio || '',
        location: employer.location || '',
        phone: employer.phone || '',
        role: 'recruiter',
        skills: [],
        experience: 0,
        salary_min: 0,
        salary_max: 0,
        job_type: 'full-time',
        preferred_locations: [],
        company: (employer as Recruiter).company || '',
        industry: (employer as Recruiter).industry || '',
        companyName: (employer as Recruiter).company || '',
        companySizeMin: (employer as Recruiter).companySizeMin || 0,
        companySizeMax: (employer as Recruiter).companySizeMax || 0,
        address: (employer as Recruiter).address || '',
        foundedYear: (employer as Recruiter).foundedYear || 0,
        companyDescription: (employer as Recruiter).companyDescription || '',
        employerRole: (employer as Recruiter).employerRole || '',
        requirements: (employer as Recruiter).requirements || [],
        companyTypes: (employer as Recruiter).companyTypes || [],
        companyLocation: (employer as Recruiter).companyLocation || '',
        cv_link: ''
      });
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAdd = (variable: "skills" | "preferred_locations"| "certifications" | "workExperience") => {
    if (variable === "skills") {
      if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, newSkill.trim()]
        }));
        setNewSkill('');
      }
    }
    else if (variable === "preferred_locations") {
      if (newLocation.trim() && !formData.preferred_locations.includes(newLocation.trim())) {
        setFormData(prev => ({
          ...prev,
          preferred_locations: [...prev.preferred_locations, newLocation.trim()]
        }));
        setNewLocation('');
      }
    }
  };

  const handleRemove = (variable: "skills" | "preferred_locations"| "certifications" | "workExperience", skillToRemove: string) => {
    if (variable === "skills") {
      setFormData(prev => ({
        ...prev,
        skills: prev.skills.filter(skill => skill !== skillToRemove)
      }));
    }
    else if (variable === "preferred_locations") {
      setFormData(prev => ({
        ...prev,
        preferred_locations: prev.preferred_locations.filter(location => location !== skillToRemove)
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // API call
    try {
      // Update formData with companySize before saving
      const dataToSave = {
        ...formData,
        companySize: formData.role === 'recruiter' ? `${formData.companySizeMin}-${formData.companySizeMax}` : undefined
      };
      
      console.log('Submitting form data:', dataToSave);
      
      var apiFile = '';
      
      if (formData.role === 'recruiter') {
        apiFile = '/api/updateRecruiterData';
      }
      else {
        apiFile = '/api/updateCandidateData';
      }

      const response = await fetch(apiFile, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });

      const result = await response.json();
      console.log(`API Response: ${result}`);

      if (response.ok) {  
        console.log("Profile updated successfully, refetching data from API");

        // Update global auth context + localStorage
        try {
          if (typeof setUser === 'function') {
            setUser({ ...(user || {}), ...dataToSave } as any);
          }
          const stored = localStorage.getItem('matchpro_user');
          if (stored) {
            const parsed = JSON.parse(stored || '{}');
            localStorage.setItem('matchpro_user', JSON.stringify({ ...parsed, ...dataToSave }));
          }
        } catch (e) {
          console.warn('Failed to update local user cache:', e);
        }

        // Revalidate SWR caches to fetch fresh data from API
        if (formData.role === 'candidate') {
          mutateCandidates();
        } else if (formData.role === 'recruiter') {
          mutateRecruiters();
        }

        
      } else {
        console.error('Failed to update profile:', result);
        alert(`Failed to update profile: ${result.error || result.message || 'Unknown error'}`);
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Error updating profile: ${error.message}`);
    } finally {
      // Refetch profile from API to ensure UI shows latest persisted data
      await loadProfile();
      setEmailError('');
      setIsSaving(false);
      setIsEditing(false);
      // In a real implementation, save to Supabase here
    }
  };

  const handleCancel = () => {
    setEmailError('');
    setIsEditing(false);
    loadProfile(); // Reset form data
  };

  if (isEditing) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <User className="w-8 h-8 text-blue-600 mr-3" />
                Settings
              </h1>
              <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancel}
                className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                <X className="w-5 h-5 inline mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Settings Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex border-b border-gray-100">
              <button className="px-6 py-4 text-blue-600 border-b-2 border-blue-600 font-medium flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile
              </button>
 
            </div>
          </div>

          {/* Edit Form */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

              <div className="flex items-start space-x-6 mb-6">
                <img
                  src={formData.avatar_url}
                  alt={formData.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {formData.role === 'candidate' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={formData.professional_title}
                      onChange={(e) => handleInputChange('professional_title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => { handleInputChange('email', e.target.value); if (emailError) setEmailError(''); }}
                      onBlur={(e) => {
                        const val = e.target.value || '';
                        const re = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,6}$/;
                        if (val && !re.test(val)) {
                          setEmailError('Enter a valid email including "@" and domain extension (e.g. yourname@example.com)');
                        } else {
                          setEmailError('');
                        }
                      }}
                      pattern="^[^\\s@]+@[^\\s@]+\\.[a-zA-Z]{2,6}$"
                      title="Enter a valid email (must include '@' and a domain extension like .com)"
                      aria-invalid={emailError ? "true" : "false"}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {emailError && (
                      <p className="mt-2 text-sm text-red-600">{emailError}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      maxLength={10}
                      onChange={(e) => handleInputChange('phone', e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {formData.role === 'candidate' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
                {formData.role === 'recruiter' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employer Role
                      </label>
                      <input
                        type="text"
                        value={formData.employerRole}
                        onChange={(e) => handleInputChange('employerRole', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Skills - Only for Candidates */}
            {formData.role === 'candidate' && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills</h2>

                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemove("skills", skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdd("skills")}
                    placeholder="Add a skill"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleAdd("skills")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Job Preferences - Only for Candidates */}
            {formData.role === 'candidate' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Job Preferences</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Salary
                    </label>
                    <input
                      type="number"
                      value={formData.salary_min}
                      onChange={(e) => handleInputChange('salary_min', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Salary
                    </label>
                    <input
                      type="number"
                      value={formData.salary_max}
                      onChange={(e) => handleInputChange('salary_max', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Type
                  </label>
                  <select
                    value={formData.job_type}
                    onChange={(e) => handleInputChange('job_type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Internship</option>
                    <option value="temporary">Temporary</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Locations
                  </label>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.preferred_locations.map((location, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center"
                    >
                      {location}
                      <button
                        onClick={() => handleRemove("preferred_locations", location)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdd("preferred_locations")}
                    placeholder="Add a location"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleAdd("preferred_locations")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}


            {/* Company Information - Only for Recruiters */}
            {formData.role === 'recruiter' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">   
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Size</label>
                     <input
                      type="number"
                      value={formData.companySizeMin}
                      onChange={(e) => handleInputChange('companySizeMin', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Size</label>
                    <input
                      type="number"
                      value={formData.companySizeMax}
                      onChange={(e) => handleInputChange('companySizeMax', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Founded Year
                    </label>
                    <input
                      type="number"
                      value={formData.foundedYear}
                      onChange={(e) => handleInputChange('foundedYear', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Description
                  </label>
                  <textarea
                    value={formData.companyDescription}
                    onChange={(e) => handleInputChange('companyDescription', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your company..."
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // View Mode
  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <User className="w-8 h-8 text-blue-600 mr-3" />
              Settings
            </h1>
            <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit Profile
          </button>
        </div>

        {/* Settings Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex border-b border-gray-100">
            <button className="px-6 py-4 text-blue-600 border-b-2 border-blue-600 font-medium flex items-center">
              <User className="w-5 h-5 mr-2" />
              Profile
            </button>
    
          </div>
        </div>

        {/* View Content */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

            <div className="flex items-start space-x-6">
              <img
                src={formData.avatar_url}
                alt={formData.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">{formData.name}</h3>
                <p className="text-lg text-gray-600 mb-4">{formData.professional_title}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {formData.email}
                  </div>
                  {formData.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {formData.phone}
                    </div>
                  )}
                  {formData.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {formData.location}
                    </div>
                  )}
                  {formData.role === 'candidate' && formData.experience > 0 && (
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {formData.experience} years experience
                    </div>
                  )}

                  {formData.role === 'recruiter' && formData.employerRole && (
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {formData.employerRole}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {formData.bio && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Professional Bio</h3>
                <p className="text-gray-700 leading-relaxed">{formData.bio}</p>
              </div>
            )}

            
            {/* CV Button */}
            {(user as Candidate)?.aiAnalysis?.resume?.cv_link && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Curriculum Vitae</h3>
                <a
                  href={(user as Candidate).aiAnalysis.resume.cv_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-colors border border-blue-200"
                >
                  <FileText className="w-4 h-4" />
                  <span>View CV</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Skills - Only for Candidates */}
          {formData.role === 'candidate' && formData.skills.length > 0 && (
            <div className="mb-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills</h2>

              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Job Preferences - Only for Candidates */}
          {formData.role === 'candidate' && (
            <div className="mb-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Job Preferences</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.salary_min > 0 && formData.salary_max > 0 && (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <div className="flex items-center text-green-800 mb-2">
                      <DollarSign className="w-5 h-5 mr-2" />
                      <span className="font-semibold">Salary Range</span>
                    </div>
                    <p className="text-green-900 font-medium">
                      ${formData.salary_min.toLocaleString()} - ${formData.salary_max.toLocaleString()}
                    </p>
                  </div>
                )}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center text-blue-800 mb-2">
                    <Clock className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Job Type</span>
                  </div>
                  <p className="text-blue-900 font-medium capitalize">
                    {formData.job_type.replace('-', ' ')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recruiter Company Info - Only for Recruiters */}
          {formData.role === 'recruiter' && (
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Company</span>
                    </div>
                    <p className="text-blue-800">{formData.company || "Not specified"}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">Industry</span>
                    </div>
                    <p className="text-green-800">{formData.industry || "Not specified"}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-purple-900">Company Size</span>
                    </div>
                    <p className="text-purple-800">{`${formData.companySizeMin} - ${formData.companySizeMax} Employees` || "Not specified"}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-900">Founded</span>
                    </div>
                    <p className="text-yellow-800">{formData.foundedYear || "Not specified"}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">About the Company</h4>
                  <p className="text-gray-700">{formData.companyDescription || "No description added yet"}</p>
                </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}
