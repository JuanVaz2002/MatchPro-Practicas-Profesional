import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Upload, FileText, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { Candidate } from '../../../types';

interface JobApplicationFormProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    candidate: Candidate
    // matchScore: number;
  };
  onBack: () => void;
  onSubmit: () => void;
}
export default function JobApplicationForm({ job, onBack, onSubmit }: JobApplicationFormProps) {
  const [coverLetter, setCoverLetter] = useState(`Dear Hiring Manager,

I am excited to apply for the ${job.title} position at ${job.company}. With over 6 years of experience in React and TypeScript development, I am confident that my skills and passion for creating exceptional user experiences make me an ideal candidate for this role.

In my current position, I have successfully led the development of several high-impact web applications, consistently delivering projects on time while maintaining high code quality standards. My experience with modern frontend technologies, including React, TypeScript, and state management libraries, directly aligns with your requirements.

I am particularly drawn to ${job.company}'s commitment to innovation and collaborative culture. I would welcome the opportunity to contribute to your team's success and help drive the company's technical vision forward.

Thank you for considering my application. I look forward to discussing how my experience and enthusiasm can benefit your team.

Best regards,
  ${job.candidate.name}`);
  
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit();
    }, 1500);

    const formData = {
      jobId: Number(job.id),
      candidateId: job.candidate.id
    };

    try {
      console.log('Saving application form data to MySQL:', formData);
      
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result_application = await response.json();
      console.log("API Response:", result_application);

      if (response.ok) {
        // setJobPosted(true);
        console.log("application saved successfully:", result_application);
      } else {
        console.error('Failed to save application:', result_application);
        alert(`Failed to save application: ${result_application.error || result_application.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving application:', error);
      alert(`Error saving application: ${error.message}`);
    } finally {
      setTimeout(() => {
        // setIsSubmitting(false);
      }, 2000);
    }

  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Job Details
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Apply for {job.title}</h1>
          <p className="text-gray-600 mt-2">{job.company} • {job.location}</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Details</h2>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100 mb-6">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">Your profile matches this job perfectly!</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Based on your skills and experience, you're an excellent fit for this position.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter *
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                required
              />
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information (Optional)
              </label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional information you'd like to share..."
              />
            </div>

            {/* Application Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Application Summary</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Match Score:</span>
                  <span className="text-green-600 font-medium">{job.candidate.matchScore}% - Excellent Match</span>
                </div>
                <div className="flex justify-between">
                  <span>Application Status:</span>
                  <span className="text-blue-600">Ready to Submit</span>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Submitting Application...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}