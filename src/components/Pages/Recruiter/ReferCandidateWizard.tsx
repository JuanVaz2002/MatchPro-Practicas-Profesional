import { useState, useRef, useMemo } from "react"
import {
  ChevronRight,
  ChevronLeft,
  User,
  CheckCircle,
  Search,
  AlertCircle,
  ArrowLeft,
  Loader2,
  X,
  DollarSign,
  Briefcase,
  FileText,
  Users,
} from "lucide-react"
import type { Candidate } from "../../../types"
import { useCandidates, useReferrals } from "../../../database"

interface ReferCandidateWizardProps {
  onBack: () => void
  recruiterID?: number
}

export default function ReferCandidateWizard({ onBack, recruiterID }: ReferCandidateWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  const { candidates: allCandidates, mutateCandidates } = useCandidates()
  const { referrals, mutateReferrals } = useReferrals()

  const restOfCandidates = allCandidates.filter(
    (candidate) => !referrals.some((referral) => candidate.id === referral.candidate.id),
  )

  const searchedCandidates = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      return restOfCandidates
    }

    const query = searchQuery.toLowerCase()
    return restOfCandidates.filter((candidate) => {
      const name = candidate.name?.toLowerCase() || ""
      const title = candidate.professionalTitle?.toLowerCase() || ""
      return name.includes(query) || title.includes(query)
    })
  }, [restOfCandidates, searchQuery])

  const [referralData, setReferralData] = useState({
    candidateId: 0,
    jobTitle: "",
    referralBonus: "",
    notes: "",
  })

  const [referrerData, setReferrerData] = useState({
    name: "",
    jobTitle: "",
    company: "",
    relationship: "",
  })

  const [validationErrors, setValidationErrors] = useState({
    candidate: "",
    jobTitle: "",
    referralBonus: "",
    notes: "",
    referrerName: "",
    referrerJobTitle: "",
    referrerCompany: "",
    referrerRelationship: "",
  })

  const steps = [
    { title: "Select Candidate", icon: User },
    { title: "Referral Details", icon: FileText },
    { title: "Referrer Details", icon: Users },
  ]

  const formatCurrency = (value: string): string => {
    // Remove all non-numeric characters except decimal point
    const numbersOnly = value.replace(/[^\d.]/g, "")

    // Ensure only one decimal point
    const parts = numbersOnly.split(".")
    if (parts.length > 2) {
      return parts[0] + "." + parts.slice(1).join("")
    }

    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + "." + parts[1].slice(0, 2)
    }

    return numbersOnly
  }

  const handleBonusChange = (value: string) => {
    const formatted = formatCurrency(value)
    setReferralData((prev) => ({ ...prev, referralBonus: formatted }))

    // Validate bonus amount
    const numValue = Number.parseFloat(formatted)
    if (formatted && (isNaN(numValue) || numValue <= 0)) {
      setValidationErrors((prev) => ({
        ...prev,
        referralBonus: "Please enter a valid positive amount",
      }))
    } else {
      setValidationErrors((prev) => ({ ...prev, referralBonus: "" }))
    }
  }

  const getFormattedBonusDisplay = (): string => {
    if (!referralData.referralBonus) return ""
    const numValue = Number.parseFloat(referralData.referralBonus)
    if (isNaN(numValue)) return referralData.referralBonus
    return `$${numValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setShowDropdown(true)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (value.trim().length >= 2) {
      setIsSearching(true)
      debounceTimerRef.current = setTimeout(() => {
        setIsSearching(false)
      }, 300)
    } else {
      setIsSearching(false)
    }
  }

  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setSearchQuery(candidate.name)
    setShowDropdown(false)

    // Populate job title from candidate's professional title
    setReferralData((prev) => ({
      ...prev,
      candidateId: candidate.id,
      jobTitle: candidate.professionalTitle || "",
    }))

    setValidationErrors((prev) => ({ ...prev, candidate: "" }))
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setSelectedCandidate(null)
    setShowDropdown(false)
    setReferralData((prev) => ({ ...prev, candidateId: 0, jobTitle: "" }))
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  const highlightMatch = (text: string, query: string) => {
    const safeText = (text ?? "").toString()
    if (!query.trim() || query.trim().length < 2) return safeText

    const parts = safeText.split(new RegExp(`(${query})`, "gi"))
    return (
      <>
        {parts.map((part, idx) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={idx} className="bg-yellow-200 font-semibold">
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </>
    )
  }

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return selectedCandidate !== null
      case 1:
        return (
          referralData.jobTitle.trim() !== "" &&
          referralData.referralBonus.trim() !== "" &&
          Number.parseFloat(referralData.referralBonus) > 0 &&
          referralData.notes.trim() !== ""
        )
      case 2:
        return (
          referrerData.name.trim() !== "" &&
          referrerData.jobTitle.trim() !== "" &&
          referrerData.company.trim() !== "" &&
          referrerData.relationship.trim() !== ""
        )
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!isStepValid(2)) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: referralData.candidateId,
          jobTitle: referralData.jobTitle,
          referralBonus: Number.parseFloat(referralData.referralBonus),
          notes: referralData.notes,
          referrer: referrerData
        }),
      })

      const result = await response.json()

      if (response.ok) {
        alert(`Referral submitted successfully for ${selectedCandidate?.name}!`)
        mutateReferrals() // Refresh referrals list
        onBack()
      } else {
        alert(`Failed to submit referral: ${result.error || result.message || "Unknown error"}`)
      }
    } catch (err: any) {
      console.error("Error submitting referral:", err)
      alert(`Error submitting referral: ${err?.message || "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderCandidateSelection = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Select Candidate to Refer</h2>
          <p className="text-gray-600 mt-2">Search and select a candidate from your database</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Candidate <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search by candidate's name or title..."
                  className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  {isSearching && <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />}
                  {searchQuery && (
                    <button onClick={handleClearSearch} className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                </div>
              </div>

              {showDropdown && searchQuery.trim().length >= 2 && (
                <div
                  ref={dropdownRef}
                  className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto"
                >
                  {searchedCandidates.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      <User className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      No candidates found matching "{searchQuery}"
                    </div>
                  ) : (
                    searchedCandidates.map((candidate) => (
                      <button
                        key={candidate.id}
                        onClick={() => handleSelectCandidate(candidate)}
                        className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                          selectedCandidate?.id === candidate.id ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {candidate.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {highlightMatch(candidate.name, searchQuery)}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {highlightMatch(candidate.professionalTitle, searchQuery)}
                            </p>
                          </div>
                          {selectedCandidate?.id === candidate.id && (
                            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}

              {searchQuery.trim().length > 0 && searchQuery.trim().length < 2 && (
                <p className="mt-2 text-xs text-gray-500">Type at least 2 characters to search</p>
              )}
            </div>

            {selectedCandidate && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                    {selectedCandidate.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{selectedCandidate.name}</h3>
                    <p className="text-gray-600 text-sm">{selectedCandidate.professionalTitle}</p>
                    <p className="text-gray-500 text-sm mt-1">{selectedCandidate.location}</p>
                    <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                      <span>{selectedCandidate.experience} years experience</span>
                      <span>•</span>
                      <span>{selectedCandidate.skills?.length || 0} skills</span>
                    </div>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderReferralDetails = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Referral Details</h2>
          <p className="text-gray-600 mt-2">Provide information about this referral</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-6">
            {/* Job Title - populated from candidate data */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={referralData.jobTitle}
                  readOnly
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                  placeholder="Job title from candidate profile"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                This field is automatically populated from the candidate's professional title
              </p>
            </div>

            {/* Referral Bonus */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referral Bonus (USD) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={referralData.referralBonus}
                  onChange={(e) => handleBonusChange(e.target.value)}
                  placeholder="Enter amount (e.g., 1500.00)"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.referralBonus ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {referralData.referralBonus && !validationErrors.referralBonus && (
                <p className="mt-1 text-sm text-green-600 font-medium">Formatted: {getFormattedBonusDisplay()}</p>
              )}
              {validationErrors.referralBonus && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validationErrors.referralBonus}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Enter the referral bonus amount in USD (e.g., 1500 or 1500.00)
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes <span className="text-red-500">*</span>
              </label>
              <textarea
                value={referralData.notes}
                onChange={(e) => {
                  const value = e.target.value
                  if (value.length <= 500) {
                    setReferralData((prev) => ({ ...prev, notes: value }))
                    setValidationErrors((prev) => ({ ...prev, notes: "" }))
                  }
                }}
                placeholder="Add any relevant notes or comments about this referral..."
                rows={5}
                maxLength={500}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  validationErrors.notes ? "border-red-500" : "border-gray-300"
                }`}
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">Provide context about why this candidate is a good fit</p>
                <p className={`text-xs ${referralData.notes.length >= 450 ? "text-red-600" : "text-gray-500"}`}>
                  {referralData.notes.length}/500
                </p>
              </div>
            </div>

            {/* Summary Card */}
            {selectedCandidate && referralData.referralBonus && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-3">Referral Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Candidate:</span>
                    <span className="font-medium text-gray-900">{selectedCandidate.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job Title:</span>
                    <span className="font-medium text-gray-900">{referralData.jobTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Referral Bonus:</span>
                    <span className="font-medium text-green-600">{getFormattedBonusDisplay()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderReferrerDetails = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Referrer Details</h2>
          <p className="text-gray-600 mt-2">Tell us about yourself and your relationship with the candidate</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-6">
            {/* Referrer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={referrerData.name}
                  onChange={(e) => {
                    setReferrerData((prev) => ({ ...prev, name: e.target.value }))
                    setValidationErrors((prev) => ({ ...prev, referrerName: "" }))
                  }}
                  placeholder="Enter your full name"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.referrerName ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {validationErrors.referrerName && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validationErrors.referrerName}
                </p>
              )}
            </div>

            {/* Referrer Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Job Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={referrerData.jobTitle}
                  onChange={(e) => {
                    setReferrerData((prev) => ({ ...prev, jobTitle: e.target.value }))
                    setValidationErrors((prev) => ({ ...prev, referrerJobTitle: "" }))
                  }}
                  placeholder="Enter your job title"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.referrerJobTitle ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {validationErrors.referrerJobTitle && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validationErrors.referrerJobTitle}
                </p>
              )}
            </div>

            {/* Referrer Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Company <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={referrerData.company}
                  onChange={(e) => {
                    setReferrerData((prev) => ({ ...prev, company: e.target.value }))
                    setValidationErrors((prev) => ({ ...prev, referrerCompany: "" }))
                  }}
                  placeholder="Enter your company name"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.referrerCompany ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {validationErrors.referrerCompany && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validationErrors.referrerCompany}
                </p>
              )}
            </div>

            {/* Relationship */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship with Candidate <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={referrerData.relationship}
                  onChange={(e) => {
                    setReferrerData((prev) => ({ ...prev, relationship: e.target.value }))
                    setValidationErrors((prev) => ({ ...prev, referrerRelationship: "" }))
                  }}
                  placeholder="e.g., Former colleague, Friend, Mentor"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.referrerRelationship ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {validationErrors.referrerRelationship && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validationErrors.referrerRelationship}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Describe how you know the candidate (e.g., worked together, university classmate)
              </p>
            </div>

            {/* Summary Card */}
            {selectedCandidate && referrerData.name && referrerData.relationship && (
              <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-3">Complete Referral Summary</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Candidate</p>
                    <p className="font-medium text-gray-900">{selectedCandidate.name}</p>
                    <p className="text-sm text-gray-600">{referralData.jobTitle}</p>
                  </div>
                  <div className="border-t border-purple-200 pt-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Referrer</p>
                    <p className="font-medium text-gray-900">{referrerData.name}</p>
                    <p className="text-sm text-gray-600">
                      {referrerData.jobTitle} at {referrerData.company}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Relationship:</span> {referrerData.relationship}
                    </p>
                  </div>
                  <div className="border-t border-purple-200 pt-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Bonus</p>
                    <p className="font-semibold text-green-600 text-lg">{getFormattedBonusDisplay()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderCandidateSelection()
      case 1:
        return renderReferralDetails()
      case 2:
        return renderReferrerDetails()
      default:
        return renderCandidateSelection()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Referrals
          </button>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Refer a Candidate</h1>
            <p className="text-gray-600 mt-2">Submit a candidate referral and earn a bonus when they're hired</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep

              return (
                <div key={index} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isActive
                        ? "border-blue-600 bg-blue-600 text-white"
                        : isCompleted
                          ? "border-green-600 bg-green-600 text-white"
                          : "border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                  {index < steps.length - 1 && <ChevronRight className="w-5 h-5 text-gray-300 mx-4" />}
                </div>
              )
            })}
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2 max-w-md mx-auto">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="mb-8">{renderCurrentStep()}</div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !isStepValid(currentStep)}
              className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Referral
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
