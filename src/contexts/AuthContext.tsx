"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

import type { Candidate, Recruiter } from "../types"
import { useUsers } from "../database"

// Import the interfaces we need
interface Education {
  degree: string
  school: string
  year: number
  gpa: number
}

interface WorkExperience {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string
}

interface Certification {
  title: string
  issuer: string
  year: number
  credentialId: string
}

interface JobPreferences {
  salary: {
    min: number
    max: number
  }
  location: string[]
  jobType: "full-time" | "part-time" | "contract" | "freelance" | "internship" | "temporary" | "volunteer" | "remote" | "hybrid" | "other"
}

export interface RegisterData {
  // Common user fields
  username: string
  email: string
  password: string
  fullName?: string
  phone?: string
  address?: string
  bio?: string

  // Candidate-specific
  professionalTitle?: string
  skills?: string[]
  experience?: number
  cvUploaded?: boolean
  jobPreferences?: JobPreferences
  workExperience?: WorkExperience
  certifications?: Certification
  education?: Education

  // Recruiter-specific
  company?: string
  industry?: string
  companySize?: string
  foundedYear?: number
  companyDescription?: string
  employerRole?: string
  requirements?: string[]
  companyTypes?: string[]
  companyLocation?: string

  // Role
  role: "candidate" | "recruiter"
}

interface AuthContextType {
  user: Candidate | Recruiter | null
  login: (email: string, password: string, role: "candidate" | "recruiter") => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  isLoading: boolean
  setUser: (u: Candidate | Recruiter | null) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// Remove the empty Users array since we'll get data from the hook
// const Users: (Candidate | Recruiter)[] = [];

// Remove mockUsers since it's now in the database file
// const mockUsers: (Candidate | Recruiter)[] = ...

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Candidate | Recruiter | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Get users data from the API using the new hook
  const users  = useUsers();

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("matchpro_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: "candidate" | "recruiter") => {
    setIsLoading(true)

    const foundUser =
      role === "candidate"
        ? users.candidates.find((u) => u.email === email && u.password === password && u.role === role)
        : users.recruiters.find((u) => u.email === email && u.password === password && u.role === role)

    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem("matchpro_user", JSON.stringify(foundUser))
    } else {
      throw new Error("Invalid credentials")
    }

    setIsLoading(false)
  }

  // TODO: Complete the register function
  const register = async (userData: RegisterData, role: "candidate" | "recruiter" ) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Check if email already exists

    const existingUser =
      role === "candidate"
        ? users.candidates.find((u) => u.email === userData.email && u.role === role)
        : users.recruiters.find((u) => u.email === userData.email && u.role === role)

    if (existingUser) {
      setIsLoading(false)
      throw new Error("Email already exists")
    }

    // Create new user with complete profile data
    // const newCandidateUser: Candidate = {
    //   id: Date.now(),
    //   email: userData.email,
    //   professionalTitle: userData.professionalTitle || "",
    //   name: userData.fullName || userData.username,
    //   bio: userData.bio || "",
    //   password: userData.password,
    //   avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName || userData.username)}&background=3b82f6&color=fff`,
    //   createdAt: new Date().toISOString().split("T")[0],
    //   skills: userData.skills || [],
    //   experience: userData.experience || 0,
    //   location: userData.address || "",
    //   cvUploaded: false,
    //   matchScore: 0,
    //   availability: "Not specified",
    //   company: userData.company || "",
    //   industry: userData.industry || "",
    //   phone: userData.phone || "",
    //   education: [{
    //     degree: userData.education?.degree || "",
    //     school: userData.education?.school || "",
    //     year: userData.education?.year || 0,
    //     gpa: userData.education?.gpa || 0.0
    //   }],
    //   jobPreferences: {
    //     salary: {
    //       min: userData.jobPreferences?.salary?.min || 0,
    //       max: userData.jobPreferences?.salary?.max || 0
    //     },
    //     location: userData.jobPreferences?.location || [],
    //     jobType: userData.jobPreferences?.jobType || "full-time",
    //   },
    //   role: "candidate",
    //   workExperience: [{
    //     title: userData.workExperience?.title || "",
    //     company: userData.workExperience?.company || "",
    //     location: userData.workExperience?.location || "",
    //     startDate: userData.workExperience?.startDate || "",
    //     endDate: userData.workExperience?.endDate || "",
    //     description: userData.workExperience?.description || ""
    //   }],
    //   certifications: [{
    //     title: userData.certifications?.title || "",
    //     issuer: userData.certifications?.issuer || "",
    //     year: userData.certifications?.year || 0,
    //     credentialId: userData.certifications?.credentialId || ""
    //   }],
    // }

    // // Automatically log in the user after successful registration
    // setUser(newCandidateUser)
    // localStorage.setItem("matchpro_user", JSON.stringify(newCandidateUser))
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("matchpro_user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading, setUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
