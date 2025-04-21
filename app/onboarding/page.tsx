"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { RoleSelectionStep } from "@/components/onboarding/role-selection-step";
import { LicenseVerificationStep } from "@/components/onboarding/license-verification";
import { VehicleComplianceStep } from "@/components/onboarding/vehicle-compliance";
import { MultiStepForm } from "@/components/onboarding/multi-step-form";
import { createLicense, createVehicle, updateOnboardingStatus, uploadFile } from "@/utils/supabase/onboarding";

interface RoleSelectionData {
  role: string | null;
}

interface LicenseVerificationData {
  file: File | null;
  licenseNumber: string;
  issuingDate: string | undefined;
  expiryDate: string | undefined;
  licenseType: string;
}

interface VehicleComplianceData {
  vehicleReg: string;
  vehicleType: string;
  vehicleCapacity: string;
  labelPhoto: File | null;
  sealingPhoto: File | null;
  routes: string;
}

interface FormData {
  roleSelection?: RoleSelectionData;
  licenseVerification?: LicenseVerificationData;
  vehicleCompliance?: VehicleComplianceData;
}

// Generic StepComponentProps to allow specific formData types
interface StepComponentProps<T> {
  formData: T;
  updateFormData: (data: T) => void;
}

interface Step<T = any> {
  id: string;
  title: string;
  description: string;
  component: (props: StepComponentProps<T>) => React.ReactNode;
  isOptional?: boolean;
  validate?: (formData: FormData) => boolean;
  shouldShow?: (role: string | null) => boolean;
}

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          toast.error("Please sign in to continue.");
          router.push("/sign-in");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, onboarding_step")
          .eq("id", user.id)
          .single();

        if (profileError) {
          throw new Error("Failed to fetch user profile");
        }

        if (profile) {
          setUserRole(profile.role);
          setCurrentStep(profile.onboarding_step);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router, supabase]);

  const handleFormComplete = async (formData: FormData) => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("User not authenticated");
      }

      if (formData.roleSelection?.role) {
        const { error: authUpdateError } = await supabase.auth.updateUser({
          data: { role: formData.roleSelection.role },
        });
        if (authUpdateError) {
          throw new Error("Failed to update user role");
        }

        const { error: profileUpdateError } = await supabase
          .from("profiles")
          .update({
            role: formData.roleSelection.role,
            onboarding_step: formData.roleSelection.role === "generator" ? "complete" : "license-verification",
            onboarding_completed: formData.roleSelection.role === "generator",
          })
          .eq("id", user.id);

        if (profileUpdateError) {
          throw new Error("Failed to update profile");
        }

        if (formData.roleSelection.role === "generator") {
          await updateOnboardingStatus("complete", true);
        }
      }

      if (formData.licenseVerification?.file && formData.licenseVerification?.licenseNumber) {
        const file = formData.licenseVerification.file;
        const fileExt = file.name.split(".").pop();
        const fileName = `${formData.licenseVerification.licenseNumber.replace(/\s+/g, "-")}-${Date.now()}.${fileExt}`;
        const filePath = `licenses/${fileName}`;

        await uploadFile("licenses", filePath, file);

        const { error: licenseError } = await createLicense({
          license_number: formData.licenseVerification.licenseNumber,
          issuing_date: formData.licenseVerification.issuingDate,
          expiry_date: formData.licenseVerification.expiryDate,
          license_type: formData.licenseVerification.licenseType,
          file_path: filePath,
        });
        if (licenseError) {
          throw new Error("Failed to create license");
        }

        if (userRole === "recycler" || userRole === "disposer") {
          await updateOnboardingStatus("complete", true);
        }
      }

      if (formData.vehicleCompliance?.vehicleReg && formData.vehicleCompliance?.labelPhoto) {
        const labelPhoto = formData.vehicleCompliance.labelPhoto;
        const labelExt = labelPhoto.name.split(".").pop();
        const labelFileName = `vehicle-${formData.vehicleCompliance.vehicleReg.replace(/\s+/g, "-")}-label-${Date.now()}.${labelExt}`;
        const labelPath = `vehicles/${labelFileName}`;

        await uploadFile("vehicles", labelPath, labelPhoto);

        let sealingPath = "";
        if (formData.vehicleCompliance.sealingPhoto) {
          const sealingPhoto = formData.vehicleCompliance.sealingPhoto;
          const sealingExt = sealingPhoto.name.split(".").pop();
          const sealingFileName = `vehicle-${formData.vehicleCompliance.vehicleReg.replace(/\s+/g, "-")}-sealing-${Date.now()}.${sealingExt}`;
          sealingPath = `vehicles/${sealingFileName}`;

          await uploadFile("vehicles", sealingPath, sealingPhoto);
        }

        const { error: vehicleError } = await createVehicle({
          registration_number: formData.vehicleCompliance.vehicleReg,
          vehicle_type: formData.vehicleCompliance.vehicleType,
          capacity: formData.vehicleCompliance.vehicleCapacity,
          label_photo_path: labelPath,
          sealing_photo_path: sealingPath,
          approved_routes: formData.vehicleCompliance.routes,
        });
        if (vehicleError) {
          throw new Error("Failed to create vehicle");
        }

        await updateOnboardingStatus("complete", true);
      }
    } catch (error:any) {
      console.error("Error completing onboarding:", error);
      toast.error(`Failed to complete onboarding: ${error.message || "Please try again."}`);
      return;
    }

    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" aria-live="polite">
        <div className="flex items-center space-x-2">
          <svg
            className="animate-spin h-5 w-5 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  const steps: Step[] = [
    {
      id: "roleSelection",
      title: "Select Your Role",
      description: "Choose your role in the waste management chain",
      component: (props: StepComponentProps<RoleSelectionData>) => <RoleSelectionStep {...props} />,
      validate: (formData: FormData) => !!formData.roleSelection?.role,
    },
    {
      id: "licenseVerification",
      title: "License Verification",
      description: "Upload your waste management license for verification",
      component: (props: StepComponentProps<LicenseVerificationData>) => <LicenseVerificationStep {...props} />,
      validate: (formData: FormData) =>
        !!formData.licenseVerification?.file &&
        !!formData.licenseVerification?.licenseNumber &&
        !!formData.licenseVerification?.issuingDate &&
        !!formData.licenseVerification?.expiryDate &&
        !!formData.licenseVerification?.licenseType,
      shouldShow: (role: string | null) => Boolean(role && role !== "generator"),
    },
    {
      id: "vehicleCompliance",
      title: "Vehicle Compliance Check",
      description: "Register your waste transport vehicle according to NEMA requirements",
      component: (props: StepComponentProps<VehicleComplianceData>) => <VehicleComplianceStep {...props} />,
      validate: (formData: FormData) =>
        !!formData.vehicleCompliance?.vehicleReg &&
        !!formData.vehicleCompliance?.vehicleType &&
        !!formData.vehicleCompliance?.labelPhoto &&
        !!formData.vehicleCompliance?.routes,
      shouldShow: (role: string | null) => role === "transporter",
    },
  ];

  return <MultiStepForm 
    steps={steps} 
    onComplete={handleFormComplete} 
    initialData={formData} 
    userRole={userRole}
  />;
}