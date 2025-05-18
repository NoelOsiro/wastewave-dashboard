"use client";

import { useState, useEffect } from "react";
import { Truck, Upload, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { useDebouncedCallback } from "use-debounce";
import { toast } from "sonner";

interface VehicleComplianceData {
  vehicleReg: string;
  vehicleType: string;
  vehicleCapacity: string;
  labelPhoto: File | null;
  sealingPhoto: File | null;
  routes: string;
}

interface VehicleComplianceStepProps {
  formData: VehicleComplianceData;
  updateFormData: (data: VehicleComplianceData) => void;
}

export function VehicleComplianceStep({ formData, updateFormData }: VehicleComplianceStepProps) {
  const [vehicleReg, setVehicleReg] = useState(formData.vehicleReg || "");
  const [vehicleType, setVehicleType] = useState(formData.vehicleType || "");
  const [vehicleCapacity, setVehicleCapacity] = useState(formData.vehicleCapacity || "");
  const [labelPhoto, setLabelPhoto] = useState<File | null>(formData.labelPhoto || null);
  const [sealingPhoto, setSealingPhoto] = useState<File | null>(formData.sealingPhoto || null);
  const [routes, setRoutes] = useState(formData.routes || "");
  const [activeTab, setActiveTab] = useState("details");
  const [isUploading, setIsUploading] = useState(false);

  // Debounce form data updates to prevent excessive re-renders
  const debouncedUpdate = useDebouncedCallback(updateFormData, 300);

  useEffect(() => {
    debouncedUpdate({
      vehicleReg,
      vehicleType,
      vehicleCapacity,
      labelPhoto,
      sealingPhoto,
      routes,
    });
  }, [vehicleReg, vehicleType, vehicleCapacity, labelPhoto, sealingPhoto, routes, debouncedUpdate]);

  // Validate file size and type
  const validateFile = (file: File): boolean => {
    const maxSizeMB = 5;
    const allowedTypes = ["image/jpeg", "image/png", "image/heif"];

    if (file.size / 1024 / 1024 > maxSizeMB) {
      toast.error("Please upload a file smaller than 5MB.");
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or HEIF file.");
      return false;
    }

    return true;
  };

  const handleLabelPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setIsUploading(true);
      try {
        setLabelPhoto(file);
      } catch (error) {
        console.error("Error processing label photo:", error);
        toast.error("Could not process the label photo. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSealingPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setIsUploading(true);
      try {
        setSealingPhoto(file);
      } catch (error) {
        console.error("Error processing sealing photo:", error);
        toast.error("Could not process the sealing photo. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Check if required fields are filled
  const isFormValid = vehicleReg && vehicleType && labelPhoto && routes;

  return (
    <div>
      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="details">Vehicle Details</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Photos</TabsTrigger>
          <TabsTrigger value="routes">Approved Routes</TabsTrigger>
        </TabsList>

        <div className="space-y-6">
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
                onClick={() => !isUploading && document.getElementById("label-photo")?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload vehicle label photo"
                onKeyDown={(e) => e.key === "Enter" && !isUploading && document.getElementById("label-photo")?.click()}
              >
                {isUploading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                      />
                    </svg>
                    Uploading...
                  </div>
                ) : (
                  <>
                    <Truck className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">
                      {labelPhoto ? labelPhoto.name : "Upload photo of vehicle with NEMA labels"}
                    </p>
                    <p className="text-xs text-muted-foreground">JPG, PNG, or HEIF up to 5MB</p>
                  </>
                )}
                <Input
                  id="label-photo"
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.heif"
                  onChange={handleLabelPhotoChange}
                  disabled={isUploading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sealing-photo">Vehicle Sealing (optional)</Label>
              <div
                className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => !isUploading && document.getElementById("sealing-photo")?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload vehicle sealing photo"
                onKeyDown={(e) => e.key === "Enter" && !isUploading && document.getElementById("sealing-photo")?.click()}
              >
                {isUploading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                      />
                    </svg>
                    Uploading...
                  </div>
                ) : (
                  <>
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">
                      {sealingPhoto ? sealingPhoto.name : "Upload photo showing vehicle sealing"}
                    </p>
                    <p className="text-xs text-muted-foreground">JPG, PNG, or HEIF up to 5MB</p>
                  </>
                )}
                <Input
                  id="sealing-photo"
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.heif"
                  onChange={handleSealingPhotoChange}
                  disabled={isUploading}
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
        </div>
      </Tabs>

      {!isFormValid && (
        <p className="text-sm text-destructive mt-4">
          Please fill in all required fields (Vehicle Registration, Vehicle Type, Label Photo, and Routes) to proceed.
        </p>
      )}
    </div>
  );
}