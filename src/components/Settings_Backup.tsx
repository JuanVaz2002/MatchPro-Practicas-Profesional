"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Phone,
  Calendar,
  Edit3,
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

// Stable controlled input component (passes new value to onChange)
const InputField = ({ label, type = "text", value, onChange }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
)

export default function Settings() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)

  // Initialize form data based on user role
  const initializeFormData = () => {
    const defaultValues = {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      location: user?.location || "",
      bio: user?.bio || "",
    }

    if (user?.role === "candidate") {
      const candidate = user as Candidate
      return {
        ...defaultValues,
        ...candidate,
        skills: candidate?.skills || [],
        experience: candidate?.experience || 0,
        workExperience: candidate?.workExperience || { title: "", company: "", location: "", startDate: "", endDate: "", description: "", jobType: "other" as const },
        certifications: candidate?.certifications || { title: "", issuer: "", year: 0, credentialId: "" },
        jobPreferences: candidate?.jobPreferences || { salary: { min: 0, max: 0 }, location: [], jobType: "other" as const },
        professionalTitle: candidate?.professionalTitle || "",
      }
    }

    if (user?.role === "recruiter") {
      const recruiter = user as Recruiter
      return {
        ...defaultValues,
        ...recruiter,
        company: recruiter?.company || "",
        industry: recruiter?.industry || "",
        companySize: recruiter?.companySize || "",
        address: recruiter?.address || "",
        foundedYear: recruiter?.foundedYear || 0,
        companyDescription: recruiter?.companyDescription || "",
        employerRole: recruiter?.employerRole || "",
        requirements: recruiter?.requirements || [],
        companyTypes: recruiter?.companyTypes || [],
        companyLocation: recruiter?.companyLocation || "",
      }
    }

    return defaultValues as any
  }

  const [formData, setFormData] = useState(initializeFormData())
  const [newSkill, setNewSkill] = useState("")

  const settingsSections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: SettingsIcon },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
  ]

  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills?.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills?.filter((skill) => skill !== skillToRemove) || [],
    }))
  }

  const handleSave = async () => {
    console.log("Saving profile data:", formData)
    try {
      console.log('Submitting form data:', formData);
      
      const response = await fetch('/api/updateCandidateData', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log(`API Response: ${result}`);

      if (response.ok) {  
        alert(`Profile updated successfully!\n${JSON.stringify(formData, null, 2)}`)
        console.log("Updated profile data:", formData)
      } else {
        console.error('Failed to update profile:', result);
        alert(`Failed to update profile: ${result.error || result.message || 'Unknown error'}`);
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Error updating profile: ${error.message}`);
    } finally {
      setTimeout(() => {
        setIsEditing(false);
      }, 2000);
    }
  }

  const handleCancel = () => {
    setFormData(initializeFormData())
    setIsEditing(false)
  }

  // `InputField` is defined at module scope to preserve identity between renders

  // Reusable section component
  const SectionCard = ({ title, children }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      {children}
    </div>
  )

  const renderCandidateProfile = () => (
    <div className="space-y-8">
      {/* Basic Information */}
      <SectionCard title="Basic Information">
        <div className="flex items-start space-x-6 mb-6">
          <img
            src={user?.avatar}
            alt={formData.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex-1">
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <InputField
                  label="Professional Title"
                  value={formData.professionalTitle}
                  onChange={(v: any) => handleInputChange("professionalTitle", v)}
                />
                <InputField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(v: any) => handleInputChange("email", v)}
                />
                <InputField
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(v: any) => handleInputChange("phone", v)}
                />
                <InputField
                  label="Location"
                  value={formData.location}
                  onChange={(v: any) => handleInputChange("location", v)}
                />
                <InputField
                  label="Years of Experience"
                  type="number"
                  value={formData.experience}
                  onChange={(v: any) => handleInputChange("experience", Number.parseInt(v))}
                />
              </div>
            ) : (
              <div>
                <h4 className="text-xl font-bold text-gray-900">{formData.name}</h4>
                <p className="text-gray-600 mb-3">{formData.professionalTitle}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {formData.email}
                  </span>
                  <span className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {formData.phone}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {formData.location}
                  </span>
                  <span className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    {formData.experience} years experience
                  </span>
                </div>
                {/* CV Button */}
                {(user as Candidate)?.aiAnalysis?.resume?.cv_link && (
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
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio</label>
          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={(e: any) => handleInputChange("bio", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-gray-700">{formData.bio || "No bio added yet"}</p>
          )}
        </div>
      </SectionCard>

      {/* Skills */}
      <SectionCard title="Skills">
        {isEditing ? (
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e: any) => setNewSkill(e.target.value)}
                onKeyPress={(e: any) => e.key === "Enter" && addSkill()}
                placeholder="Add a skill"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addSkill}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {formData.skills?.length ? (
              formData.skills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No skills added yet</p>
            )}
          </div>
        )}
      </SectionCard>

      {/* Job Preferences */}
      <SectionCard title="Job Preferences">
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Salary</label>
              <input
                type="number"
                value={formData.jobPreferences?.salary?.min || 0}
                onChange={(e: any) =>
                  handleNestedInputChange("jobPreferences", "salary", {
                    ...formData.jobPreferences?.salary,
                    min: Number.parseInt(e.target.value),
                  })
                }
                placeholder="Min"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Salary</label>
              <input
                type="number"
                value={formData.jobPreferences?.salary?.max || 0}
                onChange={(e: any) =>
                  handleNestedInputChange("jobPreferences", "salary", {
                    ...formData.jobPreferences?.salary,
                    max: Number.parseInt(e.target.value),
                  })
                }
                placeholder="Max"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Type</label>
              <select
                value={formData.jobPreferences?.jobType || "other"}
                onChange={(e: any) => handleNestedInputChange("jobPreferences", "jobType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-900">Salary Range</span>
              </div>
              <p className="text-green-800 text-sm">
                ${(formData.jobPreferences?.salary?.min || 0).toLocaleString()} - $
                {(formData.jobPreferences?.salary?.max || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Job Type</span>
              </div>
              <p className="text-blue-800 text-sm capitalize">{formData.jobPreferences?.jobType}</p>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  )

  const renderRecruiterProfile = () => (
    <div className="space-y-8">
      {/* Basic Information */}
      <SectionCard title="Basic Information">
        <div className="flex items-start space-x-6 mb-6">
          <img
            src={user?.avatar}
            alt={formData.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex-1">
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Full Name"
                  value={formData.name}
                  onChange={(e: any) => handleInputChange("name", e.target.value)}
                />
                <InputField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e: any) => handleInputChange("email", e.target.value)}
                />
                <InputField
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e: any) => handleInputChange("phone", e.target.value)}
                />
                <InputField
                  label="Location"
                  value={formData.location}
                  onChange={(e: any) => handleInputChange("location", e.target.value)}
                />
              </div>
            ) : (
              <div>
                <h4 className="text-xl font-bold text-gray-900">{formData.name}</h4>
                <p className="text-gray-600 mb-3">Hiring Manager</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {formData.email}
                  </span>
                  <span className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {formData.phone}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {formData.location}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Company Information */}
      <SectionCard title="Company Information">
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Company Name"
              value={formData.company}
              onChange={(v: any) => handleInputChange("company", v)}
            />
            <InputField
              label="Industry"
              value={formData.industry}
              onChange={(v: any) => handleInputChange("industry", v)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
              <select
                value={formData.companySize}
                onChange={(e: any) => handleInputChange("companySize", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>
            <InputField
              label="Founded Year"
              value={formData.foundedYear}
              onChange={(v: any) => handleInputChange("foundedYear", v)}
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
              <textarea
                value={formData.companyDescription}
                onChange={(e: any) => handleInputChange("companyDescription", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your company..."
              />
            </div>
          </div>
        ) : (
          <div>
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
                <p className="text-purple-800">{formData.companySize || "Not specified"}</p>
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
      </SectionCard>
    </div>
  )

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <SectionCard title="Account Settings">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Change Password</label>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Update Password
            </button>
          </div>
        </div>
      </SectionCard>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <SectionCard title="Notification Preferences">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-500 mt-1">Receive updates via email</p>
            </div>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Marketing Emails</h4>
              <p className="text-sm text-gray-500 mt-1">Receive promotional emails</p>
            </div>
            <input type="checkbox" className="toggle" />
          </div>
        </div>
      </SectionCard>
    </div>
  )

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <SectionCard title="Privacy & Security">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Profile Visibility</h4>
              <p className="text-sm text-gray-500 mt-1">Control who can see your profile</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>Public</option>
              <option>Private</option>
              <option>Contacts Only</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Data Export</h4>
              <p className="text-sm text-gray-500 mt-1">Download your personal data</p>
            </div>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium">
              Export Data
            </button>
          </div>
        </div>
      </SectionCard>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return user?.role === "candidate" ? renderCandidateProfile() : renderRecruiterProfile()
      case "account":
        return renderAccountSettings()
      case "notifications":
        return renderNotificationSettings()
      case "privacy":
        return renderPrivacySettings()
      default:
        return user?.role === "candidate" ? renderCandidateProfile() : renderRecruiterProfile()
    }
  }

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <SettingsIcon className="w-8 h-8 text-blue-600 mr-3" />
                Settings
              </h1>
              <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
            </div>
            {activeSection === "profile" && (
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Settings Navigation */}
          <div className="w-64">
            <nav className="space-y-2">
              {settingsSections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id)
                      setIsEditing(false)
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  )
}
