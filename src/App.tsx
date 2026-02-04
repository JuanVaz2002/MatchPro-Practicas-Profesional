"use client"

import { useState } from "react"
import { AuthProvider, useAuth } from "./contexts/AuthContext"

import AuthContainer from "./components/Pages/AuthContainer"
import Sidebar from "./components/Layout/Sidebar"

/* Recruiter */

import RecruiterDashboard from "./components/Pages/Recruiter/RecruiterDashboard"
import ClientsManagement from './components/Pages/Recruiter/ClientsManagement'
import PostJob  from "./components/Pages/Recruiter/PostJob"
import ManageJobs from "./components/Pages/Recruiter/ManageJobs"
import CandidatesDatabase from "./components/Pages/Recruiter/CandidatesDatabase"
import ReferredCandidates from "./components/Pages/Recruiter/ReferredCandidates"
import ReportsAnalytics from "./components/Pages/Recruiter/ReportsAnalytics"
import LinkedInSearch from "./components/Pages/Recruiter/LinkedInSearch"

/* Candidates */
import FillCandidateInfo from "./components/Pages/Candidate/FillCandidateInfo"
import CandidateDashboard from "./components/Pages/Candidate/CandidateDashboard"
import CVUpload from "./components/AI_tools/CVUpload"
import JobSearch from "./components/Pages/Candidate/JobSearch"

import { Candidate, Recruiter } from "./types"

import Settings from "./components/Settings"

function isNullOrEmpty(value?: string): boolean {
  return value == null || value.trim() === ""
}

function candidateNeedsProfile(candidate: Candidate): boolean {
  return (
    isNullOrEmpty(candidate.name) ||
    isNullOrEmpty(candidate.bio) ||
    isNullOrEmpty(candidate.professionalTitle) ||
    !candidate.cvUploaded ||
    !candidate.jobPreferences ||
    (candidate.skills?.length ?? 0) === 0 ||
    (candidate.workExperience?.length ?? 0) === 0 ||
    !candidate.aiAnalysis
  )
}

function AppContent() {
  const { user, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MatchPro...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthContainer />
  }

  const renderContent = () => {
    // Common routes for both roles
    if (activeTab === "settings") {
      return <Settings />
    }
    if (user.role === "candidate") {

      if(candidateNeedsProfile(user as Candidate)) {
        return <FillCandidateInfo candidate={user as Candidate}/>
      }
      else {
        const candidate = user as Candidate
        switch (activeTab) {
          case "home":
            return <CandidateDashboard candidateID={candidate.id}/>
          case "upload-cv":
            return <CVUpload candidate={candidate} />
            
          case "job-search":
            return <JobSearch setActiveTab={setActiveTab} user={candidate} />
          default:
            return <CandidateDashboard candidateID={candidate.id}/>
        }
      }

    }  else if (user.role === "recruiter") {
      const recruiter = user as Recruiter
      switch (activeTab) {
        case "home":
          return <RecruiterDashboard recruiterID={recruiter.id}/>
        case 'clients':
          return <ClientsManagement />;
        case 'post-job':
          return <PostJob userID={recruiter.id}/>;
        case 'open-positions':
          return <ManageJobs userID={recruiter.id}/>;
        case 'candidates':
          return <CandidatesDatabase userID={recruiter.id} />;
        case 'referred':
          return <ReferredCandidates recruiterID={recruiter.id} />;
        case 'report':
          return <ReportsAnalytics />;
        case 'linkedin-searh':
          return <LinkedInSearch />;
        
        default:
          return <RecruiterDashboard recruiterID={recruiter.id}/>
      }
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
