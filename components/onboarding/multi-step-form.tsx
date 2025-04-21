"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";


// Define interfaces for form data (based on step components)
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

export interface StepComponentProps<T extends RoleSelectionData | LicenseVerificationData | VehicleComplianceData = RoleSelectionData | LicenseVerificationData | VehicleComplianceData> {
  formData: T;
  updateFormData: (data: T) => void;
}

interface Step {
  id: string;
  title: string;
  description: string;
  component: (props: StepComponentProps<any>) => React.ReactNode;
  isOptional?: boolean;
  validate?: () => boolean; // Validation function for the step
}

interface MultiStepFormProps {
  steps: Step[];
  onComplete: (formData: FormData) => Promise<void>;
  initialData?: FormData;
}

export function MultiStepForm({ steps, onComplete, initialData = {} }: MultiStepFormProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStepIndex((prev) => prev - 1);
  };

  const handleSkip = () => {
    if (currentStep.isOptional && !isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const updateFormData = (
    stepId: string,
    data: RoleSelectionData | LicenseVerificationData | VehicleComplianceData,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [stepId]: data,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Could not complete the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if the current step is valid (defaults to true if no validate function)
  const isStepValid = currentStep.validate ? currentStep.validate() : true;

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle>{currentStep.title}</CardTitle>
            <span className="text-sm text-muted-foreground" aria-live="polite">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
          <CardDescription>{currentStep.description}</CardDescription>
          <Progress
            value={progress}
            className="h-2 mt-2"
            aria-label={`Progress: ${Math.round(progress)}% complete`}
          />
        </CardHeader>

        <CardContent>
          {currentStep.component({
            formData: (formData as any)[currentStep.id] || {},
            updateFormData: (data) => updateFormData(currentStep.id, data),
          })}
        </CardContent>

        <CardFooter className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isFirstStep || isSubmitting}
            aria-label="Go to previous step"
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back
          </Button>

          <div className="flex gap-2">
            {currentStep.isOptional && !isLastStep && (
              <Button
                variant="ghost"
                onClick={handleSkip}
                disabled={isSubmitting}
                aria-label="Skip this optional step"
              >
                Skip
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={isSubmitting || !isStepValid}
              aria-label={isLastStep ? "Submit form" : "Go to next step"}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Submitting...
                </>
              ) : isLastStep ? (
                "Submit"
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}