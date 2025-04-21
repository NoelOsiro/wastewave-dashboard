"use client";

import { useState, useEffect, useMemo } from "react";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";

interface LicenseVerificationData {
  file: File | null;
  licenseNumber: string;
  issuingDate: string | undefined;
  expiryDate: string | undefined;
  licenseType: string;
}

interface LicenseVerificationStepProps {
  formData: LicenseVerificationData;
  updateFormData: (data: LicenseVerificationData) => void;
}

export function LicenseVerificationStep({ formData, updateFormData }: LicenseVerificationStepProps) {
  const [file, setFile] = useState<File | null>(formData.file || null);
  const [licenseNumber, setLicenseNumber] = useState(formData.licenseNumber || "");
  const [issuingDate, setIssuingDate] = useState<Date | undefined>(
    formData.issuingDate ? new Date(formData.issuingDate) : undefined
  );
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(
    formData.expiryDate ? new Date(formData.expiryDate) : undefined
  );
  const [licenseType, setLicenseType] = useState(formData.licenseType || "");

  // Memoize the current form state to compare changes
  const currentFormState = useMemo(
    () => ({
      file,
      licenseNumber,
      issuingDate: issuingDate?.toISOString(),
      expiryDate: expiryDate?.toISOString(),
      licenseType,
    }),
    [file, licenseNumber, issuingDate, expiryDate, licenseType]
  );

  useEffect(() => {
    // Only update if the current state differs from the last prop state
    if (
      currentFormState.file !== formData.file ||
      currentFormState.licenseNumber !== formData.licenseNumber ||
      currentFormState.issuingDate !== formData.issuingDate ||
      currentFormState.expiryDate !== formData.expiryDate ||
      currentFormState.licenseType !== formData.licenseType
    ) {
      updateFormData(currentFormState);
    }
  }, [currentFormState, formData, updateFormData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size / 1024 / 1024 > 5) {
        toast.error("Please upload a file smaller than 5MB.");
        return;
      }
      if (!["image/jpeg", "image/png", "application/pdf"].includes(selected.type)) {
        toast.error("Please upload a JPG, PNG, or PDF file.");
        return;
      }
      setFile(selected);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="license-upload">Upload License Document</Label>
        <div
          className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => document.getElementById("license-upload")?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload license document"
          onKeyDown={(e) => e.key === "Enter" && document.getElementById("license-upload")?.click()}
        >
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-1">{file ? file.name : "Click to upload or drag and drop"}</p>
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
        <Select value={licenseType} onValueChange={setLicenseType} required>
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
    </div>
  );
}