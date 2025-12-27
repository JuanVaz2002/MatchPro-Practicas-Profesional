import React, { useState, useCallback } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  User, 
  GraduationCap, 
  Briefcase, 
  Award, 
  MapPin, 
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Sparkles,
  LogOut 
} from 'lucide-react';
import { Education, WorkExperience, JobPreferences, Certification, Candidate } from '../../../types';

interface CandidateRegistrationWizardProps {
  // onComplete: () => void;
  candidate: Candidate;
}

export default function CandidateRegistrationWizard({ candidate }: CandidateRegistrationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  
  // CV Upload states
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [scoreColor, setScoreColor] = useState<string>('');

  // Form data state
  const [basicInfo, setBasicInfo] = useState<Partial<Candidate>>({
    id: candidate.id,
    name: candidate.name || '',
    bio: candidate.bio || '',
    location: candidate.location || '',
    phone: candidate.phone ||'',
    company: candidate.company || '',
    industry: candidate.industry || '',
    skills: [] as string[],
    experience: candidate.experience || 0,
    professionalTitle: candidate.professionalTitle || '',
    availability: candidate.availability || '',
  });

  const [education, setEducation] = useState<Education[]>([
    { school: '', degree: '', year: new Date().getFullYear(), gpa: 0 }
  ]);

  const [jobPreferences, setJobPreferences] = useState<JobPreferences>({
    salary: { min: 50000, max: 100000 },
    location: [''],
    jobType: 'full-time'
  });

  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([
    {
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      jobType: 'full-time'
    }
  ]);

  const [certifications, setCertifications] = useState<Certification[]>([
    { title: '', issuer: '', year: new Date().getFullYear(), credentialId: '' }
  ]);

  const steps = [
    { title: 'Basic Information', icon: User },
    { title: 'Education', icon: GraduationCap },
    { title: 'Job Preferences', icon: MapPin },
    { title: 'Work Experience', icon: Briefcase },
    { title: 'Certifications', icon: Award },
  ];

  const jobTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Internship' },
    { value: 'temporary', label: 'Temporary' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'other', label: 'Other' }
  ];

  const isFieldDisabled = (field: keyof Candidate) => {
    const value = candidate?.[field];
    if (value == null) return false;
    if (typeof value === "string") return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "number") return value;
    return true; // for objects/booleans
  };
  // Basic info handlers
  const updateBasicInfo = (field: string, value: string | number | string[]) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !basicInfo.skills?.includes(skill.trim())) {
      setBasicInfo(prev => ({ ...prev, skills: [...prev.skills ?? [], skill.trim()] }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setBasicInfo(prev => ({
      ...prev,
      skills: prev.skills?.filter(skill => skill !== skillToRemove)
    }));
  };

  // Education form handlers
  const addEducation = () => {
    setEducation([...education, { school: '', degree: '', year: new Date().getFullYear(), gpa: 0 }]);
  };

  const removeEducation = (index: number) => {
    if (education.length > 1) {
      setEducation(education.filter((_, i) => i !== index));
    }
  };

  const updateEducation = (index: number, field: keyof Education, value: string | number) => {
    const updated = education.map((edu, i) => 
      i === index ? { ...edu, [field]: value } : edu
    );
    setEducation(updated);
  };

  // Job preferences handlers
  const addLocation = () => {
    setJobPreferences({
      ...jobPreferences,
      location: [...jobPreferences.location, '']
    });
  };

  const removeLocation = (index: number) => {
    if (jobPreferences.location.length > 1) {
      setJobPreferences({
        ...jobPreferences,
        location: jobPreferences.location.filter((_, i) => i !== index)
      });
    }
  };

  const updateLocation = (index: number, value: string) => {
    const updated = jobPreferences.location.map((loc, i) => 
      i === index ? value : loc
    );
    setJobPreferences({ ...jobPreferences, location: updated });
  };

  // Work experience handlers
  const addWorkExperience = () => {
    setWorkExperience([...workExperience, {
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      jobType: 'full-time'
    }]);
  };

  const removeWorkExperience = (index: number) => {
    if (workExperience.length > 1) {
      setWorkExperience(workExperience.filter((_, i) => i !== index));
    }
  };

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: string) => {
    const updated = workExperience.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    setWorkExperience(updated);
  };

  // Certification handlers
  const addCertification = () => {
    setCertifications([...certifications, { title: '', issuer: '', year: new Date().getFullYear(), credentialId: '' }]);
  };

  const removeCertification = (index: number) => {
    if (certifications.length > 1) {
      setCertifications(certifications.filter((_, i) => i !== index));
    }
  };

  const updateCertification = (index: number, field: keyof Certification, value: string | number) => {
    const updated = certifications.map((cert, i) => 
      i === index ? { ...cert, [field]: value } : cert
    );
    setCertifications(updated);
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const completeProfile = {
      basicInfo,
      education,
      jobPreferences,
      workExperience,
      certifications    
    };

    console.log('Complete profile data:', completeProfile);
    

    try {
      // console.log('Saving profile form data to MySQL:', completeProfile);
      
      const response = await fetch('/api/candidate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeProfile),
      });

    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Error updating profile: ${error.message}`);
    } finally {
      setTimeout(() => {
        // setIsSubmitting(false);
      }, 2000);
    }

    // setAssignCandidate(false);
    // setSelectedApplication(null);




    // Simulate API call to save complete profile
    // setTimeout(() => {
    //   setIsSubmitting(false);
    //   if (onComplete) {
    //     onComplete();
    //   }
    // }, 2000);
  };

  // Step validation
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0: // Basic Information
        return !!(basicInfo.name && basicInfo.bio && basicInfo.location && basicInfo.phone && basicInfo.company && basicInfo.industry && (basicInfo.skills?.length ?? 0) > 0);
      case 1: // Education
        return education.every(edu => edu.school !== '' && edu.degree !== '' && edu.year && edu.gpa >= 2.0);
      case 2: // Job Preferences
        return !!(jobPreferences.jobType && jobPreferences.salary.min && jobPreferences.salary.max);
      case 3: // Work Experience
      case 4: // Certifications
        return true;
      case 5: // Complete the account
        return analysisComplete;
      default:
        return false;
    }
  };

  // Form step renderers
  const renderBasicInformation = () => {
    const handleAddSkill = () => {
      addSkill(skillInput);
      setSkillInput('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddSkill();
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
          <p className="text-gray-600 mt-2">Tell us about yourself and your professional background</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                // disabled={isFieldDisabled('name')}
                value={basicInfo.name}
                onChange={(e) => updateBasicInfo('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
                required
              />
            </div>}
            {
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Title *
              </label>
              <input
                type="text"
                value={basicInfo.professionalTitle}
                onChange={(e) => updateBasicInfo('professionalTitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Senior Software Developer"
                required
              />
            </div>}

            {
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                value={basicInfo.company}
                onChange={(e) => updateBasicInfo('company', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Current or most recent company"
              />
            </div>}

            {
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <input
                type="text"
                value={basicInfo.industry}
                onChange={(e) => updateBasicInfo('industry', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Technology, Healthcare, Finance"
              />
            </div>}

            {
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience *
              </label>
              <input
                type="number"
                value={basicInfo.experience}
                onChange={(e) => updateBasicInfo('experience', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="5"
                min="0"
                max="50"
                required
              />
            </div>}

            {
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={basicInfo.location}
                onChange={(e) => updateBasicInfo('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City, Country"
              />
            </div>}

            {
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Bio
              </label>
              <textarea
                value={basicInfo.bio}
                onChange={(e) => updateBasicInfo('bio', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Brief description of your professional background, expertise, and career goals..."
              />
            </div>}
              
            {
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills *
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {basicInfo.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a skill (e.g., React, Python, Project Management)"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>}
          </div>
        </div>
      </div>
    );
  };

  const renderEducationForm = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <GraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Education Background</h2>
        <p className="text-gray-600 mt-2">Tell us about your educational qualifications</p>
      </div>

      {education.map((edu, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Education #{index + 1}</h3>
            {education.length > 1 && (
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="text-red-600 hover:text-red-700 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University/School *
              </label>
              <input
                type="text"
                value={edu.school}
                onChange={(e) => updateEducation(index, 'school', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., University of Helsinki"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Degree *
              </label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Bachelor of Science in Computer Science"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Graduation Year *
              </label>
              <input
                type="number"
                value={edu.year}
                onChange={(e) => updateEducation(index, 'year', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1950"
                max="2030"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GPA (0-4 scale)
              </label>
              <input
                type="number"
                value={edu.gpa}
                onChange={(e) => updateEducation(index, 'gpa', parseFloat(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="4"
                step="0.1"
                placeholder="e.g., 3.6"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addEducation}
        className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Education
      </button>
    </div>
  );

  const renderJobPreferencesForm = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Job Preferences</h2>
        <p className="text-gray-600 mt-2">Tell us about your ideal job requirements</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Type</h3>
        <select
          value={jobPreferences.jobType}
          onChange={(e) => setJobPreferences({ ...jobPreferences, jobType: e.target.value as any })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          {jobTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Annual Salary Expectations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Salary (USD) *
            </label>
            <input
              type="number"
              value={jobPreferences.salary.min}
              onChange={(e) => setJobPreferences({
                ...jobPreferences,
                salary: { ...jobPreferences.salary, min: parseInt(e.target.value) }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="1000"
              placeholder="50000"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Salary (USD) *
            </label>
            <input
              type="number"
              value={jobPreferences.salary.max}
              onChange={(e) => setJobPreferences({
                ...jobPreferences,
                salary: { ...jobPreferences.salary, max: parseInt(e.target.value) }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="1000"
              placeholder="100000"
              required
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Locations</h3>
        {jobPreferences.location.map((location, index) => (
          <div key={index} className="flex items-center space-x-3 mb-3">
            <input
              type="text"
              value={location}
              onChange={(e) => updateLocation(index, e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Helsinki, Finland or Remote"
              required
            />
            {jobPreferences.location.length > 1 && (
              <button
                type="button"
                onClick={() => removeLocation(index)}
                className="text-red-600 hover:text-red-700 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addLocation}
          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Location
        </button>
      </div>
    </div>
  );

  const renderWorkExperienceForm = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Briefcase className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
        <p className="text-gray-600 mt-2">Share your professional background</p>
      </div>

      {workExperience.map((exp, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Experience #{index + 1}</h3>
            {workExperience.length > 1 && (
              <button
                type="button"
                onClick={() => removeWorkExperience(index)}
                className="text-red-600 hover:text-red-700 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={exp.title}
                onChange={(e) => updateWorkExperience(index, 'title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Senior Software Developer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., TechCorp Inc."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Type *
              </label>
              <select
                value={exp.jobType}
                onChange={(e) => updateWorkExperience(index, 'jobType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {jobTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => updateWorkExperience(index, 'location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Helsinki, Finland"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={exp.startDate}
                onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={exp.endDate}
                onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty if currently employed</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              value={exp.description}
              onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Describe your responsibilities, achievements, and key projects..."
              required
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addWorkExperience}
        className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Experience
      </button>
    </div>
  );

  const renderCertificationsForm = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
        <p className="text-gray-600 mt-2">Add your professional certifications and achievements</p>
      </div>

      {certifications.map((cert, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Certification #{index + 1}</h3>
            {certifications.length > 1 && (
              <button
                type="button"
                onClick={() => removeCertification(index)}
                className="text-red-600 hover:text-red-700 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certification Title *
              </label>
              <input
                type="text"
                value={cert.title}
                onChange={(e) => updateCertification(index, 'title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., AWS Certified Solutions Architect"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issuing Organization *
              </label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Amazon Web Services"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Year *
              </label>
              <input
                type="number"
                value={cert.year}
                onChange={(e) => updateCertification(index, 'year', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1950"
                max="2030"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credential ID
              </label>
              <input
                type="text"
                value={cert.credentialId}
                onChange={(e) => updateCertification(index, 'credentialId', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., AWS-SAA-123456"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addCertification}
        className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Certification
      </button>
    </div>
  );


  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInformation();
      case 1:
        return renderEducationForm();
      case 2:
        return renderJobPreferencesForm();
      case 3:
        return renderWorkExperienceForm();
      case 4:
        return renderCertificationsForm();
      default:
        return renderBasicInformation();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Your Professional Profile</h1>
          <p className="text-gray-600 mt-2">
            Complete all steps to build a comprehensive profile that attracts top employers
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const isValid = isStepValid(index);
              
              return (
                <div key={index} className="flex items-center flex-shrink-0">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive 
                      ? 'border-blue-600 bg-blue-600 text-white' 
                      : isCompleted 
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`ml-2 text-sm font-medium whitespace-nowrap ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-gray-300 mx-4 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="mb-8">
          {renderCurrentStep()}
        </div>

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
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Creating Profile...
                </>
              ) : (
                'Complete Registration'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}