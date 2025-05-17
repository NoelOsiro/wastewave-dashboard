"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { RoleSelectionStep } from "@/components/onboarding/role-selection-step";
import { LicenseVerificationStep } from "@/components/onboarding/license-verification";
import { VehicleComplianceStep } from "@/components/onboarding/vehicle-compliance";
import { MultiStepForm } from "@/components/onboarding/multi-step-form";
import { createLicense, createVehicle, updateOnboardingStatus, uploadFile } from "@/utils/onboarding";
import { LicenseVerificationData, RoleSelectionData, Step, StepComponentProps, VehicleComplianceData } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { getAuth } from "@clerk/nextjs/server";

interface FormData {
  roleSelection?: RoleSelectionData;
  licenseVerification?: LicenseVerificationData;
  vehicleCompliance?: VehicleComplianceData;
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


export default function OnboardingPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const { isSignedIn, user } = useUser();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!isSignedIn || !user) {
          toast.error("Please sign in to continue.");
          router.push("/sign-in");
          return;
        }

        const profile = await prisma.profile.findUnique({
          where: {
            id: user.id,
          },
        });

        if (!profile) {
          throw new Error("Failed to fetch user profile");
        }

        if (profile) {
          setUserRole(profile.role);
          setCurrentStep(profile.onboardingStep);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router, user]);

  const handleFormComplete = async (formData: FormData) => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      if (formData.roleSelection?.role) {
        // Get Clerk client instance
        const client = await clerkClient();
        
        // Update Clerk user metadata
        await client.users.updateUser(user.id, {
          publicMetadata: {
            ...user.publicMetadata,
            role: formData.roleSelection.role,
          },
        });

        // Update Prisma profile
        const profileUpdateResult = await prisma.profile.update({
          where: { userId: user.id },
          data: {
            role: formData.roleSelection.role,
            onboardingStep: formData.roleSelection.role === "generator" ? "complete" : "license-verification",
            onboardingCompleted: formData.roleSelection.role === "generator",
          },
        });

        if (!profileUpdateResult) {
          throw new Error("Failed to update profile");
        }

        try {
          const vehicleUpdate = await prisma.profile.update({
            where: {
              id: user.id,
            },
            data: {
              role: formData.roleSelection.role,
              onboardingStep: formData.roleSelection.role === "generator" ? "complete" : "license-verification",
              onboardingCompleted: formData.roleSelection.role === "generator",
            },
          });

          if (!vehicleUpdate) {
            throw new Error("Failed to update vehicle profile");
          }
        } catch (error) {
          console.error("Error updating vehicle profile:", error);
          throw error;
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

        try {
          await createLicense({
            licenseNumber: formData.licenseVerification.licenseNumber,
            issuingDate: formData.licenseVerification.issuingDate,
            expiryDate: formData.licenseVerification.expiryDate,
            licenseType: formData.licenseVerification.licenseType,
            file: file,
          });
        } catch (error) {
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
        const sealingPhoto = formData.vehicleCompliance.sealingPhoto;
        if (sealingPhoto) {
          const sealingExt = sealingPhoto.name.split(".").pop();
          const sealingFileName = `vehicle-${formData.vehicleCompliance.vehicleReg.replace(/\s+/g, "-")}-sealing-${Date.now()}.${sealingExt}`;
          sealingPath = `vehicles/${sealingFileName}`;

          await uploadFile("vehicles", sealingPath, sealingPhoto);
        }

        try {
          await createVehicle({
            vehicleReg: formData.vehicleCompliance.vehicleReg,
            vehicleType: formData.vehicleCompliance.vehicleType,
            vehicleCapacity: formData.vehicleCompliance.vehicleCapacity,
            labelPhoto: labelPhoto,
            sealingPhoto: sealingPhoto || null,
            routes: formData.vehicleCompliance.routes,
          });
        } catch (error) {
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
  return <MultiStepForm 
    steps={steps} 
    onComplete={handleFormComplete} 
    initialData={formData} 
    userRole={userRole}
  />;
}