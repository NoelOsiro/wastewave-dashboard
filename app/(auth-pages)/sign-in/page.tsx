"use client" // Mark as Client Component

import type React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { FormMessage, type Message } from "@/components/form-message"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, Building, Home, Trash2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createClient } from "@/utils/supabase/client"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("house") // Default to 'house'
  const [message, setMessage] = useState<Message | null>(null)
  const [errors, setErrors] = useState<{ email?: string; password?: string; role?: string }>({})
  const [pending, setPending] = useState(false)

  // Client-side form validation
  const validateForm = () => {
    const newErrors: { email?: string; password?: string; role?: string } = {}

    // Email validation
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    // Role validation (optional, since default is set)
    if (!role) {
      newErrors.role = "Please select a role"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    setPending(true)

    // Validate form before submission
    if (!validateForm()) {
      setPending(false)
      return
    }

    try {
      // Sign in with Supabase Authentication
      const supabase = createClient()
      const {
        data: { session },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Role verified, redirect to dashboard
      setMessage({ type: "success", message: "Sign in successful" })
      toast.success("Sign in successful")
      router.push("/dashboard")
    } catch (error: unknown) {
      console.error("Sign-in error:", error)
      let errorMessage = "An unexpected error occurred"

      if (error instanceof Error) {
        errorMessage = error.message
      }

      setMessage({ type: "error", message: errorMessage })
      toast.error(errorMessage)
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        {/* Left side - Gradient Background */}
        <div className="bg-gradient-to-br from-[#004d29] to-[#003d21] p-10 flex-1 flex flex-col items-center justify-center text-white relative overflow-hidden">
          <div className="z-10 max-w-md text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-white/80 text-lg mb-8">
              Log in to your account to access all features and manage your waste collection efficiently.
            </p>
            <div className="hidden md:block">
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-3">WasteWave Platform</h3>
                <p className="text-sm opacity-80">
                  Our integrated platform connects homeowners, building managers, and waste collection companies for
                  efficient waste management.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="p-8 flex-1 flex flex-col justify-center items-center">
          <div className="w-full max-w-lg">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold">Sign in</h1>
                    <p className="text-sm text-muted-foreground mt-2">Select your role and enter your credentials</p>
                  </div>

                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <Label className="text-sm font-medium">I am a:</Label>
                      <RadioGroup value={role} onValueChange={setRole} name="role" className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col items-center text-center space-y-2 border rounded-lg p-4 hover:bg-[#004d29] cursor-pointer has-[:checked]:bg-[#004d29] has-[:checked]:border-primary">
                          <Home className="h-6 w-6 text-primary" />
                          <RadioGroupItem value="house" id="house" className="sr-only" />
                          <Label htmlFor="house" className="text-sm cursor-pointer">
                            House
                          </Label>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-2 border rounded-lg p-4 hover:bg-[#004d29] cursor-pointer has-[:checked]:bg-[#004d29] has-[:checked]:border-primary">
                          <Building className="h-6 w-6 text-primary" />
                          <RadioGroupItem value="house_manager" id="manager" className="sr-only" />
                          <Label htmlFor="manager" className="text-sm cursor-pointer">
                            Building Manager
                          </Label>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-2 border rounded-lg p-4 hover:bg-[#004d29] cursor-pointer has-[:checked]:bg-[#004d29] has-[:checked]:border-primary">
                          <Trash2 className="h-6 w-6 text-primary" />
                          <RadioGroupItem value="admin" id="admin" className="sr-only" />
                          <Label htmlFor="admin" className="text-sm cursor-pointer">
                            Waste Company
                          </Label>
                        </div>
                      </RadioGroup>
                      {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password" className="text-sm font-medium">
                          Password
                        </Label>
                        <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                          Forgot Password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>

                    <Button aria-disabled={pending} type="submit">
                      {pending ? "Submitting.." : "Sign In"}
                    </Button>

                    {message && <FormMessage message={message} />}

                    <div className="text-center mt-4">
                      <p className="text-sm text-muted-foreground">
                        Need an account?{" "}
                        <Link className="text-primary hover:underline font-medium" href="/sign-up">
                          Sign up
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
