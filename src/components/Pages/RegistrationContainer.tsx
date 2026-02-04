"use client"

import { useState } from "react"
import RegistrationForm from "./RegistrationForm"
import EmployerProfileForm from "./Recruiter/EmployerProfileForm"
import { useAuth } from "../../contexts/AuthContext"

interface RegistrationContainerProps {
  onShowLogin: () => void
}

interface RegistrationData {
  fullName: string
  email: string
  password: string
  role: "recruiter"
}

export default function RegistrationContainer({ onShowLogin }: RegistrationContainerProps) {
  const { register } = useAuth()
  const [currentStep, setCurrentStep] = useState<"registration" | "profile">("registration")
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null)

  const handleRegistrationComplete = (data: RegistrationData) => {
    setRegistrationData(data)
    setCurrentStep("profile")
  }

  const handleProfileComplete = async (profileData: any) => {
    if (!registrationData) return

    try {
      const completeUserData = {
        ...registrationData,
        ...profileData,
      }

      // Call the register function from AuthContext
      await register(completeUserData)

      // User is now automatically logged in, no need to redirect to login
    } catch (error) {
      console.error("Registration failed:", error)
      alert("Registration failed. Please try again.")
    }
  }

  const handleBackToRegistration = () => {
    setCurrentStep("registration")
  }

  if (currentStep === "registration") {
    return <RegistrationForm onShowLogin={onShowLogin} onRegistrationComplete={handleRegistrationComplete} />
  }

  if (currentStep === "profile" && registrationData) {
    return (
      <EmployerProfileForm
        onComplete={handleProfileComplete}
        onBack={handleBackToRegistration}
        initialData={{
          fullName: registrationData.fullName,
        }}
      />
    )
  }

  return null
}
