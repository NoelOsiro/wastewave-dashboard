"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { RoleSelectionStep } from "@/components/onboarding/role-selection-step";
import { LicenseVerificationStep } from "@/components/onboarding/license-verification";
import { VehicleComplianceStep } from "@/components/onboarding/vehicle-compliance";
import { MultiStepForm } from "@/components/onboarding/multi-step-form";
import { LicenseVerificationData, RoleSelectionData, Step, StepComponentProps, VehicleComplianceData } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useOnboarding } from "@/hooks/use-onboarding";

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
  const { isSignedIn, user } = useUser();
  const { fetchUserData, updateUserProfile, userRole, loading } = useOnboarding();
  const [formData, setFormData] = useState<FormData>({});

  useEffect(() => {
    if (!isSignedIn || !user) return;

    (async () => {
      try {
        const profile = await fetchUserData();
        if (profile) {
          setFormData((prev) => ({
            ...prev,
            roleSelection: profile.role ? { role: profile.role } : undefined,
          }));
        }
      } catch (err) {
        toast.error("Failed to load profile");
        console.error(err);
      }
    })();
  }, [isSignedIn, user, fetchUserData]);

  const handleFormComplete = async (formData: FormData) => {
    try {
      if (!user) throw new Error("User not authenticated");
      const role = formData.roleSelection?.role;

      if (role) {
        await updateUserProfile({
          role,
          onboardingStep: role === "generator" ? "complete" : "license-verification",
          onboardingCompleted: role === "generator",
        });
      }

      router.push("/dashboard");
    } catch (err: any) {
      toast.error(`Onboarding failed: ${err.message}`);
    }
  };

  if (loading) return <LoadingScreen />;

  const visibleSteps = useMemo(() => {
    return steps.filter(
      (step) => !step.shouldShow || step.shouldShow(userRole)
    );
  }, [userRole]);

  return (
    <MultiStepForm
      steps={visibleSteps}
      onComplete={handleFormComplete}
      initialData={formData}
      userRole={userRole}
    />
  );
}