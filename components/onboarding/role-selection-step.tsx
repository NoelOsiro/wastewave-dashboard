"use client";

import { useState } from "react";
import { Truck, Recycle, Building2, User } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { StepComponentProps } from "./multi-step-form";

interface RoleSelectionData {
  role: string | null;
}

interface Role {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function RoleSelectionStep({ formData, updateFormData }: StepComponentProps<RoleSelectionData>) {
  const [selectedRole, setSelectedRole] = useState<string | null>(formData.role || null);

  const roles: Role[] = [
    {
      id: "transporter",
      title: "Waste Transporter",
      description: "I collect and transport waste from generators to treatment/disposal facilities",
      icon: Truck,
    },
    {
      id: "recycler",
      title: "Recycler/Processor",
      description: "I process waste for recycling, recovery, or reuse",
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
      description: "I generate waste that needs proper disposal (house, business, etc.)",
      icon: User,
    },
  ];

  // Handle role selection with error handling
  const handleRoleChange = (value: string) => {
    try {
      setSelectedRole(value);
      updateFormData({ role: value });
    } catch (error) {
      toast.error("Failed to select role. Please try again.")
    }
  }

  // Check if a role is selected
  const isFormValid = !!selectedRole;

  return (
    <div>
      <RadioGroup
        value={selectedRole || ""}
        onValueChange={handleRoleChange}
        className="space-y-4"
        aria-label="Select your role in the waste management chain"
      >
        {roles.map((role) => (
          <div
            key={role.id}
            className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors ${
              selectedRole === role.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
            }`}
            onClick={() => handleRoleChange(role.id)}
            role="radio"
            aria-checked={selectedRole === role.id}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleRoleChange(role.id)}
          >
            <RadioGroupItem value={role.id} id={role.id} className="sr-only" />
            <role.icon
              className={`h-5 w-5 ${selectedRole === role.id ? "text-primary" : "text-muted-foreground"}`}
              aria-hidden="true"
            />
            <div className="flex-1">
              <Label
                htmlFor={role.id}
                className="text-base font-medium cursor-pointer"
                aria-label={role.title}
              >
                {role.title}
              </Label>
              <p className="text-sm text-muted-foreground">{role.description}</p>
            </div>
          </div>
        ))}
      </RadioGroup>

      {!isFormValid && (
        <p className="text-sm text-destructive mt-4">
          Please select a role to proceed.
        </p>
      )}
    </div>
  );
}