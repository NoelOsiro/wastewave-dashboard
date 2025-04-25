"use client" // Mark as Client Component
import type React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { type Message } from "@/components/form-message"
import { toast } from "sonner"
import { createClient } from "@/utils/supabase/client"
import renderFrom from "@/components/auth/SignInForm"
import { backdround } from "@/components/auth/BackGround"
import RenderFrom from "@/components/auth/SignInForm"



export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("house") // Default to 'house'
  const [message, setMessage] = useState<Message | null>(null)
  const [errors, setErrors] = useState<{ email?: string; password?: string; role?: string }>({})
  const [pending, setPending] = useState(false)

  return (
    <>
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        {/* Left side - Gradient Background */}
        {backdround}
        {/* Right side - Form */}
        <RenderFrom/>
      </div>
    </>
  )
}


