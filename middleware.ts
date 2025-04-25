import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  const publicRoutes = ["/", "/sign-in", "/sign-up", "/onboarding","/forgot-password","/reset-passwrd"]

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Redirect if not logged in
  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  const userRole = user.user_metadata?.role

  // Onboarding status check
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single()

  if (error || !profile) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  if (!profile.onboarding_completed && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", request.url))
  }

  // Restrict access to certain base paths to specific roles
  const rolePathMap: Record<string, string> = {
    generator: "/generator",
    transporter: "/transporter",
    recycler: "/recycler",
    disposer: "/disposer",
  }

  for (const [role, basePath] of Object.entries(rolePathMap)) {
    if (pathname.startsWith(basePath) && userRole !== role) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // DENY specific paths per role
  const roleDeniedPathsMap: Record<string, string[]> = {
    recycler: ["/houses", "/houses/", "/houses/new"], // you can add more
    transporter: ["/houses", "/houses/", "/houses/new"],
    generator: [],
    disposer: ["/houses", "/houses/", "/houses/new"],
  }

  const deniedPaths = roleDeniedPathsMap[userRole] || []
  const isDenied = deniedPaths.some(path => pathname.startsWith(path))

  if (isDenied) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
