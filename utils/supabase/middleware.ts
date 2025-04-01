
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const { data: { user } } = await supabase.auth.getUser();

    // protected routes based on authentication
    if (request.nextUrl.pathname.startsWith("/protected") && !user) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    
    // Role-based route protection
    if (user) {
      const userRole = user.user_metadata.role;
      
      // Admin-only routes
      if (request.nextUrl.pathname.startsWith("/admin") && userRole !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      
      // House manager routes
      if (request.nextUrl.pathname.startsWith("/manager") && userRole !== "house_manager") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      
      // House routes
      if (request.nextUrl.pathname.startsWith("/resident") && userRole !== "house") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
    
    // General protected routes
    if (!user) {
      if (request.nextUrl.pathname.startsWith("/houses") ||
          request.nextUrl.pathname.startsWith("/payments") ||
          request.nextUrl.pathname.startsWith("/profile") ||
          request.nextUrl.pathname.startsWith("/schedule")) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }
    
    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
