
import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Public routes that don't require authentication
  if (["/", "/sign-in", "/sign-up", "/auth/callback", "/auth/confirm"].includes(pathname)) {
    return NextResponse.next()
  }

  // If no user, redirect to sign-in
  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  // Check onboarding status for authenticated users
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("onboarding_completed, role")
    .eq("id", user.id)
    .single()

  if (error || !profile) {
    console.error("Error fetching user profile:", error?.message)
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  // If onboarding is not completed, redirect to onboarding
  if (!profile.onboarding_completed && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", request.url))
  }

  // Role-based route protection
  const role = profile.role
  
  // Admin/waste company routes
  if (pathname.startsWith("/admin") && role !== "disposer") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // House manager routes
  if (pathname.startsWith("/manager") && role !== "recycler") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // House routes
  if (pathname.startsWith("/resident") && role !== "generator") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Transporter routes
  if (pathname.startsWith("/transporter") && role !== "transporter") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Allow access to protected routes
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
}
