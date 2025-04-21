import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import LicenseVerification from "./license-verification"
import RoleSelection from "./row-selection"
import VehicleCompliance from "./vehicle-compliance"


export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("onboarding_completed, onboarding_step")
    .eq("id", user.id)
    .single()

  if (profileError || !profile) {
    console.error("Error fetching user profile:", profileError?.message)
    redirect("/sign-in")
  }

  if (profile.onboarding_completed) {
    redirect("/dashboard")
  }

  switch (profile.onboarding_step) {
    case "role-selection":
      return <RoleSelection />
    case "license-verification":
      return <LicenseVerification />
    case "vehicle-compliance":
      return <VehicleCompliance />
    default:
      return <RoleSelection />
  }
}
