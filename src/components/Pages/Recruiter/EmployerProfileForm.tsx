"use client"

import type React from "react"

import { useState } from "react"
import { Building, FileText, Users, ArrowLeft, ArrowRight, X } from "lucide-react"

interface EmployerProfileData {
  fullName: string
  phone: string
  address: string
  companyName: string
  industry: string
  companySize: string
  foundedYear: number
  companyDescription: string
  employerRole: string
  requirements: string[]
  companyTypes: string[]
  companyLocation: string
}

interface EmployerProfileFormProps {
  onComplete: (data: EmployerProfileData) => void
  onBack: () => void
  initialData?: Partial<EmployerProfileData>
}

const companySizeOptions = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1000+ employees",
]

const companyTypeOptions = [
  "Full-time",
  "Part-time freelance",
  "Short-term freelance contract",
  "Long-term contract",
  "Project-based",
  "Consulting",
]

export default function EmployerProfileForm({ onComplete, onBack, initialData }: EmployerProfileFormProps) {
  const [formData, setFormData] = useState<EmployerProfileData>({
    fullName: initialData?.fullName || "",
    phone: "",
    address: "",
    companyName: initialData?.companyName || "",
    industry: initialData?.industry || "",
    companySize: initialData?.companySize || "",
    foundedYear: new Date().getFullYear(),
    companyDescription: "",
    employerRole: "",
    requirements: [],
    companyTypes: [],
    companyLocation: "",
    ...initialData,
  })

  const [currentRequirement, setCurrentRequirement] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required"
    if (!formData.industry.trim()) newErrors.industry = "Industry is required"
    if (!formData.companySize) newErrors.companySize = "Company size is required"
    if (formData.foundedYear < 1800 || formData.foundedYear > new Date().getFullYear()) {
      newErrors.foundedYear = "Please enter a valid founded year"
    }
    if (!formData.companyDescription.trim()) newErrors.companyDescription = "Company description is required"
    if (!formData.employerRole.trim()) newErrors.employerRole = "Your role is required"
    if (!formData.companyLocation.trim()) newErrors.companyLocation = "Company location is required"
    if (formData.companyTypes.length === 0) newErrors.companyTypes = "Select at least one company type"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onComplete(formData)
    }
  }

  const addRequirement = () => {
    if (currentRequirement.trim() && !formData.requirements.includes(currentRequirement.trim())) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, currentRequirement.trim()],
      }))
      setCurrentRequirement("")
    }
  }

  const removeRequirement = (requirement: string) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((r) => r !== requirement),
    }))
  }

  const toggleCompanyType = (companyType: string) => {
    setFormData((prev) => ({
      ...prev,
      companyTypes: prev.companyTypes.includes(companyType)
        ? prev.companyTypes.filter((t) => t !== companyType)
        : [...prev.companyTypes, companyType],
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Company Profile</h1>
            <p className="text-gray-600 mt-2">Tell us about your company to attract the best candidates</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2" />
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Role</label>
                <input
                  type="text"
                  value={formData.employerRole}
                  onChange={(e) => setFormData((prev) => ({ ...prev, employerRole: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.employerRole ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., HR Manager, CEO, Recruiter"
                />
                {errors.employerRole && <p className="text-red-500 text-sm mt-1">{errors.employerRole}</p>}
              </div>
            </div>

            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Company Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.companyName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter company name"
                  />
                  {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData((prev) => ({ ...prev, industry: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.industry ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., Technology, Healthcare"
                  />
                  {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                  <select
                    value={formData.companySize}
                    onChange={(e) => setFormData((prev) => ({ ...prev, companySize: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.companySize ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select company size</option>
                    {companySizeOptions.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  {errors.companySize && <p className="text-red-500 text-sm mt-1">{errors.companySize}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Founded Year</label>
                  <input
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={formData.foundedYear}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        foundedYear: Number.parseInt(e.target.value) || new Date().getFullYear(),
                      }))
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.foundedYear ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="2020"
                  />
                  {errors.foundedYear && <p className="text-red-500 text-sm mt-1">{errors.foundedYear}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Location</label>
                <input
                  type="text"
                  value={formData.companyLocation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, companyLocation: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.companyLocation ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., San Francisco, CA"
                />
                {errors.companyLocation && <p className="text-red-500 text-sm mt-1">{errors.companyLocation}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                <textarea
                  value={formData.companyDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, companyDescription: e.target.value }))}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.companyDescription ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Describe your company, mission, and values..."
                />
                {errors.companyDescription && <p className="text-red-500 text-sm mt-1">{errors.companyDescription}</p>}
              </div>
            </div>

            {/* Hiring Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Hiring Information
              </h3>

              {/* Company Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type of Company/Hiring</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {companyTypeOptions.map((companyType) => (
                    <button
                      key={companyType}
                      type="button"
                      onClick={() => toggleCompanyType(companyType)}
                      className={`px-3 py-2 rounded-lg border-2 transition-all text-sm ${
                        formData.companyTypes.includes(companyType)
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {companyType}
                    </button>
                  ))}
                </div>
                {errors.companyTypes && <p className="text-red-500 text-sm mt-1">{errors.companyTypes}</p>}
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">General Requirements (Optional)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentRequirement}
                    onChange={(e) => setCurrentRequirement(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add a requirement and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.requirements.map((requirement) => (
                    <span
                      key={requirement}
                      className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {requirement}
                      <button
                        type="button"
                        onClick={() => removeRequirement(requirement)}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
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
