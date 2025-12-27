"use client"

import type React from "react"

import { useState } from "react"
import { User, Briefcase, Star, ArrowLeft, ArrowRight, X } from "lucide-react"

interface CandidateProfileData {
  fullName: string
  phone: string
  address: string
  professionalTitle: string
  skills: string[]
  experience: number
  jobPreferences: {
    salaryMin: number
    salaryMax: number
    workTypes: string[]
    locations: string[]
  }
}

interface CandidateProfileFormProps {
  onComplete: (data: CandidateProfileData) => void
  onBack: () => void
  initialData?: Partial<CandidateProfileData>
}

const workTypeOptions = ["Full-time", "Part-time", "Remote", "On-site", "Hybrid", "Contract", "Freelance"]

export default function CandidateProfileForm({ onComplete, onBack, initialData }: CandidateProfileFormProps) {
  const [formData, setFormData] = useState<CandidateProfileData>({
    fullName: initialData?.fullName || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    professionalTitle: "",
    skills: [],
    experience: 0,
    jobPreferences: {
      salaryMin: 0,
      salaryMax: 0,
      workTypes: [],
      locations: [],
    },
    ...initialData,
  })

  const [currentSkill, setCurrentSkill] = useState("")
  const [currentLocation, setCurrentLocation] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.professionalTitle.trim()) newErrors.professionalTitle = "Professional title is required"
    if (formData.skills.length === 0) newErrors.skills = "At least one skill is required"
    if (formData.experience < 0) newErrors.experience = "Experience cannot be negative"
    if (formData.jobPreferences.salaryMin <= 0) newErrors.salaryMin = "Minimum salary must be greater than 0"
    if (formData.jobPreferences.salaryMax <= formData.jobPreferences.salaryMin) {
      newErrors.salaryMax = "Maximum salary must be greater than minimum salary"
    }
    if (formData.jobPreferences.workTypes.length === 0) newErrors.workTypes = "Select at least one work type"
    if (formData.jobPreferences.locations.length === 0) newErrors.locations = "Add at least one preferred location"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onComplete(formData)
    }
  }

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()],
      }))
      setCurrentSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const addLocation = () => {
    if (currentLocation.trim() && !formData.jobPreferences.locations.includes(currentLocation.trim())) {
      setFormData((prev) => ({
        ...prev,
        jobPreferences: {
          ...prev.jobPreferences,
          locations: [...prev.jobPreferences.locations, currentLocation.trim()],
        },
      }))
      setCurrentLocation("")
    }
  }

  const removeLocation = (location: string) => {
    setFormData((prev) => ({
      ...prev,
      jobPreferences: {
        ...prev.jobPreferences,
        locations: prev.jobPreferences.locations.filter((l) => l !== location),
      },
    }))
  }

  const toggleWorkType = (workType: string) => {
    setFormData((prev) => ({
      ...prev,
      jobPreferences: {
        ...prev.jobPreferences,
        workTypes: prev.jobPreferences.workTypes.includes(workType)
          ? prev.jobPreferences.workTypes.filter((t) => t !== workType)
          : [...prev.jobPreferences.workTypes, workType],
      },
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
            <p className="text-gray-600 mt-2">Tell us about yourself to get better job matches</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your address"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Professional Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
                  <input
                    type="text"
                    value={formData.professionalTitle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, professionalTitle: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.professionalTitle ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., Software Developer"
                  />
                  {errors.professionalTitle && <p className="text-red-500 text-sm mt-1">{errors.professionalTitle}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, experience: Number.parseInt(e.target.value) || 0 }))
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.experience ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0"
                  />
                  {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add a skill and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
              </div>
            </div>

            {/* Job Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Job Preferences
              </h3>

              {/* Salary Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Salary ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.jobPreferences.salaryMin}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        jobPreferences: {
                          ...prev.jobPreferences,
                          salaryMin: Number.parseInt(e.target.value) || 0,
                        },
                      }))
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.salaryMin ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="50000"
                  />
                  {errors.salaryMin && <p className="text-red-500 text-sm mt-1">{errors.salaryMin}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Salary ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.jobPreferences.salaryMax}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        jobPreferences: {
                          ...prev.jobPreferences,
                          salaryMax: Number.parseInt(e.target.value) || 0,
                        },
                      }))
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.salaryMax ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="100000"
                  />
                  {errors.salaryMax && <p className="text-red-500 text-sm mt-1">{errors.salaryMax}</p>}
                </div>
              </div>

              {/* Work Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Work Types</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {workTypeOptions.map((workType) => (
                    <button
                      key={workType}
                      type="button"
                      onClick={() => toggleWorkType(workType)}
                      className={`px-3 py-2 rounded-lg border-2 transition-all text-sm ${
                        formData.jobPreferences.workTypes.includes(workType)
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {workType}
                    </button>
                  ))}
                </div>
                {errors.workTypes && <p className="text-red-500 text-sm mt-1">{errors.workTypes}</p>}
              </div>

              {/* Preferred Locations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Locations</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLocation())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add a location and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addLocation}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.jobPreferences.locations.map((location) => (
                    <span
                      key={location}
                      className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {location}
                      <button
                        type="button"
                        onClick={() => removeLocation(location)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                {errors.locations && <p className="text-red-500 text-sm mt-1">{errors.locations}</p>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={onBack}
                className="flex items-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <button
                type="submit"
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Complete Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
