"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Truck, Upload, MapPin, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createVehicle, updateOnboardingStatus, uploadFile } from "@/utils/supabase/onboarding"

export default function VehicleCompliance() {
  const router = useRouter()
  const [vehicleReg, setVehicleReg] = useState("")
  const [vehicleType, setVehicleType] = useState("")
  const [vehicleCapacity, setVehicleCapacity] = useState("")
  const [labelPhoto, setLabelPhoto] = useState<File | null>(null)
  const [sealingPhoto, setSealingPhoto] = useState<File | null>(null)
  const [routes, setRoutes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleLabelPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLabelPhoto(e.target.files[0])
    }
  }

  const handleSealingPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSealingPhoto(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!vehicleReg || !vehicleType || !routes) {
      setErrorMessage("Please fill all required fields")
      setSubmitStatus("error")
      return
    }

    if (!labelPhoto) {
      setErrorMessage("Please upload a photo of your vehicle labels")
      setSubmitStatus("error")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Upload label photo
      const labelExt = labelPhoto.name.split(".").pop()
      const labelFileName = `vehicle-${vehicleReg.replace(/\s+/g, "-")}-label-${Date.now()}.${labelExt}`
      const labelPath = `vehicles/${labelFileName}`

      await uploadFile("vehicles", labelPath, labelPhoto)

      // Upload sealing photo if available
      let sealingPath = ''
      if (sealingPhoto) {
        const sealingExt = sealingPhoto.name.split(".").pop()
        const sealingFileName = `vehicle-${vehicleReg.replace(/\s+/g, "-")}-sealing-${Date.now()}.${sealingExt}`
        sealingPath = `vehicles/${sealingFileName}`

        await uploadFile("vehicles", sealingPath, sealingPhoto)
      }

      // Save vehicle data to database
      await createVehicle({
        registration_number: vehicleReg,
        vehicle_type: vehicleType,
        capacity: vehicleCapacity,
        label_photo_path: labelPath,
        sealing_photo_path: sealingPath,
        approved_routes: routes,
      })

      // Update onboarding status
      await updateOnboardingStatus("tracking-document")

      setSubmitStatus("success")
      setTimeout(() => {
        router.push("/onboarding")
      }, 2000)
    } catch (error: any) {
      console.error("Error registering vehicle:", error)
      setErrorMessage(error.message || "Failed to register vehicle")
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Compliance Check</CardTitle>
          <CardDescription>Register your waste transport vehicle according to NEMA requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="details">Vehicle Details</TabsTrigger>
              <TabsTrigger value="compliance">Compliance Photos</TabsTrigger>
              <TabsTrigger value="routes">Approved Routes</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-6">
              <TabsContent value="details" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-reg">Vehicle Registration Number</Label>
                  <Input
                    id="vehicle-reg"
                    value={vehicleReg}
                    onChange={(e) => setVehicleReg(e.target.value)}
                    placeholder="e.g. KBZ 123A"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle-type">Vehicle Type</Label>
                  <Input
                    id="vehicle-type"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    placeholder="e.g. Truck, Van, Pickup"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle-capacity">Capacity (optional)</Label>
                  <Input
                    id="vehicle-capacity"
                    value={vehicleCapacity}
                    onChange={(e) => setVehicleCapacity(e.target.value)}
                    placeholder="e.g. 3 tonnes"
                  />
                </div>
              </TabsContent>

              <TabsContent value="compliance" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="label-photo">NEMA Required Labels</Label>
                  <div
                    className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => document.getElementById("label-photo")?.click()}
                  >
                    <Truck className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">
                      {labelPhoto ? labelPhoto.name : "Upload photo of vehicle with NEMA labels"}
                    </p>
                    <p className="text-xs text-muted-foreground">JPG, PNG or HEIF up to 5MB</p>
                    <Input
                      id="label-photo"
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.heif"
                      onChange={handleLabelPhotoChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sealing-photo">Vehicle Sealing (to prevent leaking/smell)</Label>
                  <div
                    className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => document.getElementById("sealing-photo")?.click()}
                  >
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">
                      {sealingPhoto ? sealingPhoto.name : "Upload photo showing vehicle sealing"}
                    </p>
                    <p className="text-xs text-muted-foreground">JPG, PNG or HEIF up to 5MB</p>
                    <Input
                      id="sealing-photo"
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.heif"
                      onChange={handleSealingPhotoChange}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="routes" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="routes">Approved Collection Routes</Label>
                  <Textarea
                    id="routes"
                    value={routes}
                    onChange={(e) => setRoutes(e.target.value)}
                    placeholder="List your approved waste collection routes"
                    rows={6}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Specify the areas and routes your vehicle is approved to collect waste from
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Route validation will be performed by administrators</span>
                </div>
              </TabsContent>

              {submitStatus === "error" && (
                <div className="bg-destructive/10 p-3 rounded-md flex items-center text-sm">
                  <AlertCircle className="h-4 w-4 mr-2 text-destructive" />
                  <span className="text-destructive">{errorMessage}</span>
                </div>
              )}

              {submitStatus === "success" && (
                <div className="bg-green-100 p-3 rounded-md flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  <span className="text-green-600">Vehicle registered successfully! Redirecting...</span>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Register Vehicle"}
              </Button>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
