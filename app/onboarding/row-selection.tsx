"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Truck, Recycle, Building2, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useUser } from "@clerk/nextjs"
import { clerkClient } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"


const roles = [
  {
    id: "transporter",
    title: "Waste Transporter",
    description:
      "I collect and transport waste from generators to treatment/disposal facilities",
    icon: Truck,
  },
  {
    id: "recycler",
    title: "Recycler/Processor",
    description: "I process waste for recycling, recovery or reuse",
    icon: Recycle,
  },
  {
    id: "disposer",
    title: "Disposal Facility",
    description: "I operate a facility for final disposal of waste",
    icon: Building2,
  },
  {
    id: "generator",
    title: "Waste Generator",
    description: "I generate waste that needs proper disposal (house, business..)",
    icon: User,
  },
]


export default function RoleSelection() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isLoaded, user } = useUser();
  const client = clerkClient()

  const handleContinue = async () => {
    if (!selectedRole) return

    setIsSubmitting(true)

    try {
      if (!user) {
        throw new Error("User not found")
      }
      // update user metadata role
      const client = await clerkClient();
      const updatedUser = await client.users.updateUser(user.id, {
        publicMetadata: {
          role: selectedRole,
        },
      })




      const nextStep = selectedRole === "generator" ? "complete" : "license-verification"

      try {
        await prisma.profile.update({
          where: {
            id: user.id
          },
          data: {
            role: selectedRole,
            onboardingStep: nextStep,
            onboardingCompleted: selectedRole === "generator",
          }
        })
      } catch (error) {
        throw error
      }

      router.refresh()
      router.push("/onboarding")
    } catch (error) {
      console.error("Error updating role:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Select Your Role</CardTitle>
          <CardDescription>Choose your role in the waste management chain</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedRole || ""}
            onValueChange={setSelectedRole}
            className="space-y-4"
          >
            {roles.map((role) => (
              <div
                key={role.id}
                className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors ${selectedRole === role.id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                  }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <RadioGroupItem value={role.id} id={role.id} className="sr-only" />
                <role.icon
                  className={`h-5 w-5 ${selectedRole === role.id ? "text-primary" : "text-muted-foreground"
                    }`}
                />
                <div className="flex-1">
                  <Label htmlFor={role.id} className="text-base font-medium cursor-pointer">
                    {role.title}
                  </Label>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button onClick={handleContinue} disabled={!selectedRole || isSubmitting} className="w-full">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
