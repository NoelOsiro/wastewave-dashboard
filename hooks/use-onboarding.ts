"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export interface UseOnboardingResult {
  userRole: string | null;
  currentStep: string | null;
  loading: boolean;
  fetchUserData: () => Promise<any | null>;
  updateUserProfile: (data: { role: string; onboardingStep: string; onboardingCompleted: boolean }) => Promise<void>;
}

export const useOnboarding = (): UseOnboardingResult => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      if (!isSignedIn || !user) {
        toast.error("Please sign in to continue.");
        router.push("/sign-in");
        return null;
      }

      const res = await fetch(`/api/profile/${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch user profile");

      const profile = await res.json();
      setUserRole(profile.role);
      setCurrentStep(profile.onboardingStep);
      return profile;
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (data: { role: string; onboardingStep: string; onboardingCompleted: boolean }) => {
    try {
      if (!isSignedIn || !user) {
        toast.error("Please sign in to continue.");
        router.push("/sign-in");
        return;
      }

      const res = await fetch(`/api/profile/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          role: data.role,
          onboardingStep: data.onboardingStep,
          onboardingCompleted: data.onboardingCompleted,
        }),
      });
      if (!res.ok) throw new Error("Failed to update user profile");

      const profile = await res.json();
      setUserRole(profile.role);
      setCurrentStep(profile.onboardingStep);
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Failed to update user data. Please try again.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [isSignedIn, user]);

  return { userRole, currentStep, loading, fetchUserData, updateUserProfile };
};