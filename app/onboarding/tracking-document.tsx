"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Download, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import {  updateOnboardingStatus } from "@/utils/onboarding"
import { DatePicker } from "@/components/ui/date-picker"
import { TimePicker } from "@/components/ui/time-picker"

export default function TrackingDocument() {
  const router = useRouter()
  const [formCompleted, setFormCompleted] = useState(false)
  const [trackingDocument, setTrackingDocument] = useState<any>(null)

  // Form III data
  const [wasteType, setWasteType] = useState("")
  const [quantity, setQuantity] = useState("")
  const [containerCount, setContainerCount] = useState("")
  const [collectionPoint, setCollectionPoint] = useState("")
  const [disposalPoint, setDisposalPoint] = useState("")
  const [collectionDate, setCollectionDate] = useState<Date | undefined>()
  const [collectionTime, setCollectionTime] = useState<Date | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleGenerateForm = async () => {
    if (!wasteType || !quantity || !containerCount || !collectionPoint || !disposalPoint || !collectionDate) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // Combine date and time
      const combinedDate = new Date(collectionDate)
      if (collectionTime) {
        combinedDate.setHours(collectionTime.getHours())
        combinedDate.setMinutes(collectionTime.getMinutes())
      }

      // Create tracking document in database
      // const document = await createTrackingDocument({
      //   waste_type: wasteType,
      //   quantity: Number.parseFloat(quantity),
      //   container_count: Number.parseInt(containerCount),
      //   collection_point: collectionPoint,
      //   disposal_point: disposalPoint,
      //   collection_date: combinedDate.toISOString(),
      //   digital_signature: "Electronically signed",
      // })

      // Update onboarding status
      await updateOnboardingStatus("tracking_document", true)

      setTrackingDocument(document)
      setFormCompleted(true)
    } catch (error) {
      console.error("Error generating tracking document:", error)
      alert("Failed to generate tracking document. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownloadPDF = () => {
    // In a real implementation, this would generate and download a PDF
    alert("In a real implementation, this would download the Form III PDF")
  }

  const handleContinue = () => {
    router.push("/dashboard")
  }

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Tracking Document (Form III)</CardTitle>
          <CardDescription>
            Generate a digital version of the NEMA Tracking Document (Form III) required for waste transportation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!formCompleted ? (
            <div className="space-y-6">
              <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800">Important Regulatory Requirement</h4>
                    <p className="text-xs text-amber-700 mt-1">
                      According to NEMA Waste Management Regulations (2006), every waste transporter must carry a
                      Tracking Document (Form III) during transportation. Failure to comply may result in penalties.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="waste-type">Waste Type</Label>
                  <Select value={wasteType} onValueChange={setWasteType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select waste type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Waste</SelectItem>
                      <SelectItem value="organic">Organic Waste</SelectItem>
                      <SelectItem value="recyclable">Recyclable Waste</SelectItem>
                      <SelectItem value="hazardous">Hazardous Waste</SelectItem>
                      <SelectItem value="e-waste">E-Waste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (kg)</Label>
                  <Input
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    type="number"
                    placeholder="e.g. 500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="container-count">Number of Containers</Label>
                <Input
                  id="container-count"
                  value={containerCount}
                  onChange={(e) => setContainerCount(e.target.value)}
                  type="number"
                  placeholder="e.g. 10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="collection-point">Collection Point</Label>
                <Textarea
                  id="collection-point"
                  value={collectionPoint}
                  onChange={(e) => setCollectionPoint(e.target.value)}
                  placeholder="Full address of waste collection point"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="disposal-point">Disposal/Treatment Point</Label>
                <Textarea
                  id="disposal-point"
                  value={disposalPoint}
                  onChange={(e) => setDisposalPoint(e.target.value)}
                  placeholder="Full address of waste disposal/treatment facility"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Collection Date</Label>
                  <DatePicker date={collectionDate} setDate={setCollectionDate} className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label>Collection Time</Label>
                  <TimePicker date={collectionTime} setDate={setCollectionTime} className="w-full" />
                </div>
              </div>

              <Button onClick={handleGenerateForm} className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Generating..." : "Generate Tracking Document"}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-md border border-green-200 flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-green-800">Tracking Document Generated</h4>
                  <p className="text-xs text-green-700 mt-1">
                    Your digital Form III has been generated and saved to your account. You can access it anytime from
                    your dashboard.
                  </p>
                </div>
              </div>

              <div className="bg-white border rounded-md p-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold">WASTE TRACKING DOCUMENT</h3>
                  <p className="text-sm text-muted-foreground">Form III (Regulation 7)</p>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Waste Type:</p>
                      <p>{wasteType || "General Waste"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Quantity:</p>
                      <p>{quantity || "500"} kg</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">Number of Containers:</p>
                    <p>{containerCount || "10"}</p>
                  </div>

                  <div>
                    <p className="font-medium">Collection Point:</p>
                    <p>{collectionPoint || "Nairobi CBD, Kenya"}</p>
                  </div>

                  <div>
                    <p className="font-medium">Disposal/Treatment Point:</p>
                    <p>{disposalPoint || "Dandora Waste Management Facility, Nairobi"}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Collection Date:</p>
                      <p>{collectionDate?.toLocaleDateString() || new Date().toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-medium">Collection Time:</p>
                      <p>{collectionTime?.toLocaleTimeString() || "10:00 AM"}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="font-medium">Digital Signature:</p>
                    <p className="text-xs text-muted-foreground">Electronically signed by: John Doe</p>
                    <p className="text-xs text-muted-foreground">Date: {new Date().toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">
                      Verification Code: {trackingDocument?.verification_code || "WM-2023-12345-NEMA"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="flex-1" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>

                <Button className="flex-1" onClick={handleContinue}>
                  Continue to Dashboard
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
