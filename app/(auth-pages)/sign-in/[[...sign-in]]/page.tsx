"use client" // Mark as Client Component
import type React from "react"
import { backdround } from "@/components/auth/BackGround"
import { SignIn } from "@clerk/nextjs"

export default function Login() {

  return (
    <>
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        {/* Left side - Gradient Background */}
        {backdround}
        {/* Right side - Form */}
        <div className="p-8 flex-1 flex flex-col justify-center items-center">
      <div className="w-full max-w-lg">
      <SignIn/>
      </div>
      </div>
    </div>
    </>
  )
}


