import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Candidate } from '../../../types';
interface AddCandidateProps {
  onBack: () => void;
  recruiterID: number;
  addedCandidates: Candidate[]
  
}

export default function AddCandidate({ onBack, recruiterID, addedCandidates }: AddCandidateProps) {

  // Manual entry form state
  const [manualForm, setManualForm] = useState({
    email: '',
    phone: '',
    location: '',
    professionalTitle: '',
    password: ''
  });


  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call

    const body = { 
      recruiterId: recruiterID,
      email: manualForm.email,
      phone: manualForm.phone,
      location: manualForm.location,
      professionalTitle: manualForm.professionalTitle,
      password: manualForm.password
    };

    console.log('Manual candidate entry:', body);
    try {
      
      const response = await fetch('/api/addCandidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok) {
        console.log(`Candidate added successfully:`, result);
        
      } else {
        console.error(`Failed to add candidate:`, result);
        alert(`Failed to add candidate: ${result.error || result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(`Error adding candidate:`, error);
      alert(`Error adding candidate: ${error.message}`);
    } finally {
      setTimeout(() => {
        
      }, 2000);
    }

    setManualForm({
      email: '',
      phone: '',
      location: '',
      professionalTitle: '',
      password: ''
    });
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
            Back to Search
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Add Candidate</h1>
          <p className="text-gray-600 mt-2">Enter candidate information directly</p>
        </div>

        <form onSubmit={handleManualSubmit} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={manualForm.email}
                onChange={(e) => setManualForm({...manualForm, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                value={manualForm.password}
                onChange={(e) => setManualForm({...manualForm, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={manualForm.phone}
                onChange={(e) => setManualForm({...manualForm, phone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={manualForm.location}
                onChange={(e) => setManualForm({...manualForm, location: e.target.value})}
                placeholder="City, State/Country"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Role
              </label>
              <input
                type="text"
                value={manualForm.professionalTitle}
                onChange={(e) => setManualForm({...manualForm, professionalTitle: e.target.value})}
                placeholder="e.g. Senior Software Engineer"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Candidate
            </button>
            <button
              type="button"
              onClick={onBack}
              className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}