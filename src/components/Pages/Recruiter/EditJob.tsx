import React, { useState } from 'react';
import { ArrowLeft, Save, Eye, Trash2, Pause, Play } from 'lucide-react';
import { useJobsRecruiter } from '../../../database';
interface EditJobProps {
  jobId: string;
  recruiterID: number;
  onBack: () => void;
  onSave: (jobData: any) => void;
}

export default function EditJob({ jobId, recruiterID, onBack, onSave }: EditJobProps) {
  // Mock job data - in real app, this would be fetched based on jobId
  const job = useJobsRecruiter(recruiterID).find(j => j.id === Number(jobId));

  const [formData, setFormData] = useState({
    title: job?.title || "",
    company: job?.company || "",
    department: job?.department || "",
    location: job?.location || "",
    experience: job?.experience || 0,
    description: job?.description || "",
    workType: job?.job_type || "other",
    salaryMin: job?.salary.min || 0,
    salaryMax: job?.salary.max || 0,
    requirements: job?.requirements || [],
    benefits: job?.benefits || [],
    skills: job?.skills || [],
    steps: job?.steps || [],
    status: job?.status || "paused",
    jobId: jobId,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (
    field: 'requirements' | 'benefits' | 'skills'| 'steps',
    index: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item: string, i: number) =>
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: 'requirements' | 'benefits' | 'skills' | 'steps') => {
    setFormData(prev => ({
      ...prev,
      [field]: ([...(prev[field] as string[]), ''])
    }));
  };

  const removeArrayItem = (field: 'requirements' | 'benefits' | 'skills' | 'steps', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_: unknown, i: number) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // formData.tipo = "edit";
    setIsSubmitting(true);
    const response = await fetch('/api/jobs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
      console.log("API Response:", result);

    if (response.ok) {
      console.log(`Candidate added successfully:`, result);
    }
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onSave(formData);
      alert('Job updated successfully!');
    }, 1500);
  };

  const toggleJobStatus = () => {
    const newStatus = formData.status === 'active' ? 'paused' : 'active';
    setFormData(prev => ({ ...prev, status: newStatus }));
  };

  const deleteJob = () => {
    if (window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      alert('Job deleted successfully!');
      onBack();
    }
  };

  // Validation: disable Save when required fields are empty/zero or salaryMin > salaryMax
  const isFormInvalid =
    !formData.title.trim() ||
    !formData.company.trim() ||
    !formData.department.trim() ||
    !formData.location.trim() ||
    !formData.description.trim() ||
    Number(formData.experience) <= 0 ||
    Number(formData.salaryMin) <= 0 ||
    Number(formData.salaryMax) <= 0 ||
    Number(formData.salaryMin) > Number(formData.salaryMax);

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
            <h1 className="text-3xl font-bold text-gray-900">Job Preview</h1>
            <p className="text-gray-600 mt-2">This is how your job posting will appear to candidates</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{formData.title}</h2>
              <p className="text-gray-600 mb-4">{formData.company || 'Company'} • {formData.location}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {formData.workType.charAt(0).toUpperCase() + formData.workType.slice(1)}
                </span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  Years of Experience: {formData.experience}
                </span>
              </div>
              {formData.salaryMin && formData.salaryMax && (
                <p className="text-lg font-semibold text-gray-900">
                  ${parseInt(String(formData.salaryMin)).toLocaleString()} - ${parseInt(String(formData.salaryMax)).toLocaleString()} / year
                </p>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
              <p className="text-gray-700 leading-relaxed">{formData.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {formData.requirements.filter(req => req.trim()).map((req, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                <ul className="space-y-2">
                  {formData.benefits.filter(benefit => benefit.trim()).map((benefit, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {formData.skills.filter(skill => skill.trim()).map((skill, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Steps</h3>
              <div className="flex flex-wrap gap-2">
                {formData.steps.filter(step => step.trim()).map((step, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {step}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Apply for this Position
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
            Back to Jobs
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Job Posting</h1>
              <p className="text-gray-600 mt-2">Update your job posting details</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                formData.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-4 py-3 border borddepartmenter-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Type *
                </label>
                <select
                  value={formData.workType}
                  onChange={(e) => handleInputChange('workType', e.target.value)}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                type="number"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="5"
                min="0"
                max="50"
                required
              />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary Range (Annual)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => handleInputChange('salaryMin', parseInt(e.target.value, 10) || 0)}
                    placeholder="Minimum"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => handleInputChange('salaryMax', parseInt(e.target.value, 10) || 0)}
                    placeholder="Maximum"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Job Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements
                </label>
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                      placeholder="e.g. 3+ years of React experience"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('requirements', index)}
                        className="ml-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('requirements')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Requirement
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Benefits & Perks
                </label>
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                      placeholder="e.g. Health insurance, Stock options"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.benefits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('benefits', index)}
                        className="ml-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('benefits')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Benefit
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills
                </label>
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                      placeholder="e.g. JavaScript, React, Node.js"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.skills.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('skills', index)}
                        className="ml-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('skills')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Skill
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Steps
                </label>
                {formData.steps.map((step, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => handleArrayChange('steps', index, e.target.value)}
                      placeholder="e.g. ..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('steps', index)}
                        className="ml-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('steps')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Step
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
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

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={toggleJobStatus}
                  className={`px-6 py-3 rounded-lg transition-colors font-medium flex items-center ${
                    formData.status === 'active'
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {formData.status === 'active' ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause Job
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Activate Job
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={deleteJob}
                  className="bg-red-100 text-red-700 px-6 py-3 rounded-lg hover:bg-red-200 transition-colors font-medium flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Job
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
