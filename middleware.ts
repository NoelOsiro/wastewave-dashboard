import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Allow access to public routes
  if (["/sign-in", "/signup", "/onboarding"].includes(pathname)) {
    return NextResponse.next()
  }

  // If no user, redirect to sign-in
  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  // Check onboarding status
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single()

  if (error || !profile) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  // If onboarding is not completed, redirect to onboarding
  if (!profile.onboarding_completed && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", request.url))
  }

  // Allow access to protected routes
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}