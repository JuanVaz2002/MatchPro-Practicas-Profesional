"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Save, Eye, Trash2 } from "lucide-react"
import { useCandidates } from "../../../database"
import type { Education, WorkExperience, Certification } from "../../../types"

interface EditCandidateProps {
  candidateId: string
  onBack: () => void
}

export default function EditCandidate({ candidateId, onBack }: EditCandidateProps) {
  const { candidates } = useCandidates()
  const candidate = candidates.find((c) => c.id === Number(candidateId))

  const [formData, setFormData] = useState(() => ({
    // Basic Information
    name: "",
    email: "",
    location: "",
    phone: "",
    bio: "",
    professionalTitle: "",
    availability: "",

    // Professional Details
    company: "",
    industry: "",
    skills: [] as string[],
    experience: 0,
    cvUploaded: false,

    // Job Preferences
    salaryMin: 0,
    salaryMax: 0,
    preferredLocations: [] as string[],
    preferredJobType: "full-time",

    // Education
    education: [] as Education[],

    // Work Experience
    workExperience: [] as WorkExperience[],

    // Certifications
    certifications: [] as Certification[],

    candidateId: candidateId,
  }))

  // When the candidate data arrives (fetched asynchronously via SWR), populate form state.
  // We deep-clone arrays to avoid sharing references that could cause unexpected UI duplication.
  useEffect(() => {
    if (!candidate) return

    setFormData({
      name: candidate.name || "",
      email: candidate.email || "",
      location: candidate.location || "",
      phone: candidate.phone || "",
      bio: candidate.bio || "",
      professionalTitle: candidate.professionalTitle || "",
      availability: candidate.availability || "",

      company: candidate.company || "",
      industry: candidate.industry || "",
      skills: Array.isArray(candidate.skills) ? [...candidate.skills] : [],
      experience: candidate.experience || 0,
      cvUploaded: !!candidate.cvUploaded,

      salaryMin: candidate.jobPreferences?.salary?.min || 0,
      salaryMax: candidate.jobPreferences?.salary?.max || 0,
      preferredLocations: Array.isArray(candidate.jobPreferences?.location)
        ? [...candidate.jobPreferences!.location]
        : [],
      preferredJobType: candidate.jobPreferences?.jobType || "full-time",

      education: Array.isArray(candidate.education) ? candidate.education.map((e) => ({ ...e })) : [],
      workExperience: Array.isArray(candidate.workExperience)
        ? candidate.workExperience.map((w) => ({ ...w }))
        : [],
      certifications: Array.isArray(candidate.certifications)
        ? candidate.certifications.map((c) => ({ ...c }))
        : [],

      candidateId: candidateId,
    })
  }, [candidate, candidateId])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: "skills" | "preferredLocations", index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item: string, i: number) => (i === index ? value : item)),
    }))
  }

  const addArrayItem = (field: "skills" | "preferredLocations") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), ""],
    }))
  }

  const removeArrayItem = (field: "skills" | "preferredLocations", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_: unknown, i: number) => i !== index),
    }))
  }

  const handleEducationChange = (index: number, field: keyof Education, value: any) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)),
    }))
  }

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { degree: "", school: "", year: new Date().getFullYear(), gpa: 0 }],
    }))
  }

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_: unknown, i: number) => i !== index),
    }))
  }

  const handleWorkExperienceChange = (index: number, field: keyof WorkExperience, value: any) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)),
    }))
  }

  const addWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
          jobType: "full-time",
        },
      ],
    }))
  }

  const removeWorkExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_: unknown, i: number) => i !== index),
    }))
  }

  const handleCertificationChange = (index: number, field: keyof Certification, value: any) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => (i === index ? { ...cert, [field]: value } : cert)),
    }))
  }

  const addCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { title: "", issuer: "", year: new Date().getFullYear(), credentialId: "" },
      ],
    }))
  }

  const removeCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_: unknown, i: number) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const response = await fetch("/api/candidate", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    const result = await response.json()
    console.log("API Response:", result)

    if (response.ok) {
      console.log(`Candidate updated successfully:`, result)
    }
    setTimeout(() => {
      setIsSubmitting(false)
      // onSave(formData)
      alert("Candidate profile updated successfully!")
    }, 1500)
  }

  const deleteCandidate = () => {
    if (window.confirm("Are you sure you want to delete this candidate profile? This action cannot be undone.")) {
      alert("Candidate deleted successfully!")
      onBack()
    }
  }

  const isFormInvalid =
    !formData.name.trim() || !formData.email.trim() || !formData.location.trim() || !formData.professionalTitle.trim()

  if (showPreview) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setShowPreview(false)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Edit
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Candidate Profile Preview</h1>
            <p className="text-gray-600 mt-2">This is how your profile will appear</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            {/* Header */}
            <div className="mb-8 pb-6 border-b border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900">{formData.name}</h2>
              <p className="text-lg text-blue-600 font-medium mt-1">{formData.professionalTitle}</p>
              <p className="text-gray-600 mt-2">
                {formData.location} • {formData.phone}
              </p>
              <p className="text-gray-600">{formData.email}</p>
              {formData.bio && <p className="text-gray-700 mt-4">{formData.bio}</p>}
            </div>

            {/* Skills */}
            {formData.skills.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.skills
                    .filter((s) => s.trim())
                    .map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {formData.workExperience.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Experience</h3>
                <div className="space-y-4">
                  {formData.workExperience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <p className="text-gray-900 font-semibold">{exp.title}</p>
                      <p className="text-gray-600">
                        {exp.company} • {exp.location}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {exp.startDate} - {exp.endDate}
                      </p>
                      {exp.description && <p className="text-gray-700 mt-2">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {formData.education.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
                <div className="space-y-3">
                  {formData.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                      <p className="text-gray-900 font-semibold">{edu.degree}</p>
                      <p className="text-gray-600">{edu.school}</p>
                      <p className="text-gray-500 text-sm">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Job Preferences */}
            <div className="mt-8 bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Preferences</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Salary Range</p>
                  <p className="font-semibold text-gray-900">
                    ${formData.salaryMin} - ${formData.salaryMax}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Job Type</p>
                  <p className="font-semibold text-gray-900">{formData.preferredJobType}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600 text-sm">Preferred Locations</p>
                  <p className="font-semibold text-gray-900">{formData.preferredLocations.join(", ")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Candidates
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Candidate Profile</h1>
          <p className="text-gray-600 mt-2">Update candidate information and qualifications</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title *</label>
                <input
                  type="text"
                  value={formData.professionalTitle}
                  onChange={(e) => handleInputChange("professionalTitle", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Senior Software Engineer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select
                  value={formData.availability}
                  onChange={(e) => handleInputChange("availability", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select availability</option>
                  <option value="immediately">Immediately</option>
                  <option value="2weeks">2 Weeks Notice</option>
                  <option value="1month">1 Month Notice</option>
                  <option value="negotiable">Negotiable</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief bio about yourself"
                />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Professional Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => handleInputChange("industry", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", Number.parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="70"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CV Uploaded</label>
                <div className="flex items-center h-12">
                  <input
                    type="checkbox"
                    checked={formData.cvUploaded}
                    onChange={(e) => handleInputChange("cvUploaded", e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-gray-600">Yes, CV is uploaded</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleArrayChange("skills", index, e.target.value)}
                    placeholder="e.g. React, Node.js, Python"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formData.skills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("skills", index)}
                      className="ml-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("skills")}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
              >
                + Add Skill
              </button>
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Work Experience</h2>

            {formData.workExperience.map((exp, index) => (
              <div key={index} className="mb-8 pb-8 border-b border-gray-200 last:border-b-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => handleWorkExperienceChange(index, "title", e.target.value)}
                      placeholder="e.g. Senior Developer"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleWorkExperienceChange(index, "company", e.target.value)}
                      placeholder="Company name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => handleWorkExperienceChange(index, "location", e.target.value)}
                      placeholder="City, Country"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                    <select
                      value={exp.jobType}
                      onChange={(e) => handleWorkExperienceChange(index, "jobType", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="freelance">Freelance</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => handleWorkExperienceChange(index, "startDate", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={exp.endDate}
                      onChange={(e) => handleWorkExperienceChange(index, "endDate", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => handleWorkExperienceChange(index, "description", e.target.value)}
                    rows={3}
                    placeholder="Describe your responsibilities and achievements"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {formData.workExperience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeWorkExperience(index)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove Experience
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addWorkExperience}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add Work Experience
            </button>
          </div>

          {/* Education */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Education</h2>

            {formData.education.map((edu, index) => (
              <div key={index} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                      placeholder="e.g. Bachelor of Science"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">School/University</label>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => handleEducationChange(index, "school", e.target.value)}
                      placeholder="School name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <input
                      type="number"
                      value={edu.year}
                      onChange={(e) => handleEducationChange(index, "year", Number.parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1950"
                      max={new Date().getFullYear()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
                    <input
                      type="number"
                      value={edu.gpa}
                      onChange={(e) => handleEducationChange(index, "gpa", Number.parseFloat(e.target.value))}
                      placeholder="e.g. 3.8"
                      step="0.01"
                      min="0"
                      max="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                {formData.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="mt-4 text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove Education
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addEducation}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add Education
            </button>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Certifications</h2>

            {formData.certifications.map((cert, index) => (
              <div key={index} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Certification Title</label>
                    <input
                      type="text"
                      value={cert.title}
                      onChange={(e) => handleCertificationChange(index, "title", e.target.value)}
                      placeholder="e.g. AWS Certified Solutions Architect"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Issuer</label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => handleCertificationChange(index, "issuer", e.target.value)}
                      placeholder="e.g. Amazon Web Services"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <input
                      type="number"
                      value={cert.year}
                      onChange={(e) => handleCertificationChange(index, "year", Number.parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1950"
                      max={new Date().getFullYear()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credential ID</label>
                    <input
                      type="text"
                      value={cert.credentialId}
                      onChange={(e) => handleCertificationChange(index, "credentialId", e.target.value)}
                      placeholder="Credential reference number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                {formData.certifications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="mt-4 text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove Certification
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addCertification}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add Certification
            </button>
          </div>

          {/* Job Preferences */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Job Preferences</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Salary</label>
                <input
                  type="number"
                  value={formData.salaryMin}
                  onChange={(e) => handleInputChange("salaryMin", Number.parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Salary</label>
                <input
                  type="number"
                  value={formData.salaryMax}
                  onChange={(e) => handleInputChange("salaryMax", Number.parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Job Type</label>
              <select
                value={formData.preferredJobType}
                onChange={(e) => handleInputChange("preferredJobType", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Locations</label>
              {formData.preferredLocations.map((location, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => handleArrayChange("preferredLocations", index, e.target.value)}
                    placeholder="e.g. San Francisco, New York"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formData.preferredLocations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("preferredLocations", index)}
                      className="ml-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("preferredLocations")}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
              >
                + Add Location
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting || isFormInvalid}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </button>
              </div>

              <button
                type="button"
                onClick={deleteCandidate}
                className="bg-red-100 text-red-700 px-6 py-3 rounded-lg hover:bg-red-200 transition-colors font-medium flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Candidate
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
