import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import RoleSelection from "./row-selection"

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/signin")
  }

  // Check if user has already completed onboarding
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, onboarding_completed")
    .eq("id", session.user.id)
    .single()

  if (profile?.onboarding_completed) {
    redirect("/dashboard")
  }

  return <RoleSelection />
}
