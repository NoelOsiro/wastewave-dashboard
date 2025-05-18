"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, CheckCircle, AlertCircle, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createLicense, updateOnboardingStatus, uploadFile } from "@/utils/onboarding"
import { DatePicker } from "@/components/ui/date-picker"
import { useUser } from "@clerk/nextjs"
import { prisma } from "@/lib/prisma"

export default function LicenseVerification() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [licenseNumber, setLicenseNumber] = useState("")
  const [issuingDate, setIssuingDate] = useState<Date | undefined>()
  const [expiryDate, setExpiryDate] = useState<Date | undefined>()
  const [licenseType, setLicenseType] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const { user } = useUser();

  useEffect(() => {
    const fetchRole = async () => {
      const profile = await prisma.profile.findUnique({
        where: {
          id: user?.id
        }
      })

      if (profile?.role === "transporter") setLicenseType("transport")
      if (profile?.role === "recycler") setLicenseType("reuse")
      if (profile?.role === "disposer") setLicenseType("disposal")
      // skip generator - might not need license
    }

    fetchRole()
  }, [])
  const MAX_SIZE_MB = 5

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      if (selected.size / 1024 / 1024 > MAX_SIZE_MB) {
        setErrorMessage("File size exceeds 5MB limit")
        setUploadStatus("error")
        return
      }
      setFile(selected)
      setUploadStatus("idle")
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setErrorMessage("Please upload your license document")
      setUploadStatus("error")
      return
    }

    if (!licenseNumber || !licenseType) {
      setErrorMessage("Please fill in all required fields")
      setUploadStatus("error")
      return
    }

    setIsUploading(true)
    setUploadStatus("idle")

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${licenseNumber.replace(/\s+/g, "-")}-${Date.now()}.${fileExt}`
      const filePath = `licenses/${fileName}`

      await uploadFile("licenses", filePath, file)

      // Save license metadata to database
      await createLicense({
        licenseNumber: licenseNumber,
        issuingDate: issuingDate?.toISOString(),
        expiryDate: expiryDate?.toISOString(),
        licenseType: licenseType,
        file: file,
      })

      if (licenseType === "disposal" || licenseType === "reuse") {
        await updateOnboardingStatus("complete", true)
        setUploadStatus("success")
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        await updateOnboardingStatus("vehicle-compliance", true)
        setUploadStatus("success")
        setTimeout(() => {
          router.push("/onboarding")
        }, 2000)
      }
    } catch (error) {
      console.error("Error uploading license:", error)
      setErrorMessage(error as string || "Failed to upload license")
      setUploadStatus("error")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>License Verification</CardTitle>
          <CardDescription>Upload your waste management license for verification</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="license-upload">Upload License Document</Label>
              <div
                className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => document.getElementById("license-upload")?.click()}
              >
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-1">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground">PDF or image files up to 5MB</p>
                <Input
                  id="license-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="license-number">License Number</Label>
              <Input
                id="license-number"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="e.g. NEMA/WM/2023/001"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Issuing Date</Label>
                <DatePicker date={issuingDate} setDate={setIssuingDate} className="w-full" />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <DatePicker date={expiryDate} setDate={setExpiryDate} className="w-full" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="license-type">License Type</Label>
              <Select value={licenseType} onValueChange={setLicenseType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select license type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="disposal">Disposal</SelectItem>
                  <SelectItem value="reuse">Reuse/Recycling</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {uploadStatus === "error" && (
              <div className="bg-destructive/10 p-3 rounded-md flex items-center text-sm">
                <AlertCircle className="h-4 w-4 mr-2 text-destructive" />
                <span className="text-destructive">{errorMessage}</span>
              </div>
            )}

            {uploadStatus === "success" && (
              <div className="bg-green-100 p-3 rounded-md flex items-center text-sm">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                <span className="text-green-600">License uploaded successfully! Redirecting...</span>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isUploading} onClick={handleSubmit}>
            {isUploading ? (
              <>
                <Loader className="animate-spin h-4 w-4 mr-2" /> Uploading...
              </>
            ) : (
              "Submit for Verification"
            )}
          </Button>

        </CardFooter>
      </Card>
    </div>
  )
}
