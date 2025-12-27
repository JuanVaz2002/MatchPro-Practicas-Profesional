"use client"

import { useState } from "react"
import LoginForm from "./LoginForm"
import RegistrationContainer from "./RegistrationContainer"

export default function AuthContainer() {
  const [showRegistration, setShowRegistration] = useState(false)

  return showRegistration ? (
    <RegistrationContainer onShowLogin={() => setShowRegistration(false)} />
  ) : (
    <LoginForm onShowRegister={() => setShowRegistration(true)} />
  )
}
