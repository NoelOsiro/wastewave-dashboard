
"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Mail, Lock, User, Home, Building, Recycle, Truck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function Signup() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "generator" // Default to 'generator' (house)
  })
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Sign up with Supabase
      const supabase = createClient()
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: formData.role,
          },
        },
      })
      
      if (signUpError) throw signUpError

      // Create a profile entry
      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: data.user.id,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            onboarding_completed: formData.role === 'generator', // Auto-complete onboarding for houses
            onboarding_step: formData.role === 'generator' ? 'complete' : 'role-selection',
          })

        if (profileError) {
          console.error("Error creating profile:", profileError)
          throw new Error("Failed to create user profile")
        }
      }

      toast.success("Account created successfully! Please check your email for verification.")
      router.push("/sign-in")
    } catch (err: any) {
      console.error("Error signing up:", err)
      setError(err.message || "An error occurred during sign up")
      toast.error(err.message || "An error occurred during sign up")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        {/* Left side - Form */}
        <div className="p-8 flex-1 flex flex-col justify-center items-center order-2 md:order-1">
          <div className="w-full max-w-lg">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold">Create an account</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                      Sign up to get started with our waste management platform
                    </p>
                  </div>

                  <form className="space-y-4" onSubmit={handleSubmit}>
                    {error && (
                      <div className="p-3 text-sm bg-red-100 border border-red-300 text-red-800 rounded">{error}</div>
                    )}

                    <div className="space-y-4">
                      <Label className="text-sm font-medium">I am signing up as:</Label>
                      <RadioGroup
                        value={formData.role}
                        onValueChange={handleRoleChange}
                        name="role"
                        className="grid grid-cols-4 gap-2"
                      >
                        <div className="flex flex-col items-center text-center space-y-2 border rounded-lg p-4 hover:bg-accent cursor-pointer has-[:checked]:bg-accent has-[:checked]:border-primary">
                          <Home className="h-6 w-6 text-primary" />
                          <RadioGroupItem value="generator" id="generator" className="sr-only" />
                          <Label htmlFor="generator" className="text-sm cursor-pointer">
                            House
                          </Label>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-2 border rounded-lg p-4 hover:bg-accent cursor-pointer has-[:checked]:bg-accent has-[:checked]:border-primary">
                          <Building className="h-6 w-6 text-primary" />
                          <RadioGroupItem value="recycler" id="recycler" className="sr-only" />
                          <Label htmlFor="recycler" className="text-sm cursor-pointer">
                            Building Manager
                          </Label>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-2 border rounded-lg p-4 hover:bg-accent cursor-pointer has-[:checked]:bg-accent has-[:checked]:border-primary">
                          <Recycle className="h-6 w-6 text-primary" />
                          <RadioGroupItem value="disposer" id="disposer" className="sr-only" />
                          <Label htmlFor="disposer" className="text-sm cursor-pointer">
                            Waste Company
                          </Label>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-2 border rounded-lg p-4 hover:bg-accent cursor-pointer has-[:checked]:bg-accent has-[:checked]:border-primary">
                          <Truck className="h-6 w-6 text-primary" />
                          <RadioGroupItem value="transporter" id="transporter" className="sr-only" />
                          <Label htmlFor="transporter" className="text-sm cursor-pointer">
                            Transporter
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Your full name"
                          className="pl-10"
                          required
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10"
                          required
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Create a strong password"
                          className="pl-10"
                          minLength={6}
                          required
                          value={formData.password}
                          onChange={handleChange}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? "Signing up..." : "Sign up"}
                    </Button>

                    <div className="text-center mt-4">
                      <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link className="text-primary hover:underline font-medium" href="/sign-in">
                          Sign in
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right side - Gradient Background */}
        <div className="bg-gradient-to-bl from-primary/10 to-primary/50 p-10 flex-1 flex flex-col items-center justify-center relative overflow-hidden order-1 md:order-2">
          <div className="z-10 max-w-md text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Join Our Community</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Create an account to access our waste management platform and start managing your collections efficiently.
            </p>
            <div className="hidden md:block">
              <div className="bg-background/10 p-6 rounded-lg backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-3">Smart Waste Management</h3>
                <p className="text-sm opacity-80">
                  Join as a homeowner, building manager, waste collection company or transporter and experience our streamlined
                  waste management solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
