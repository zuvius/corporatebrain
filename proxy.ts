import { type NextRequest, NextResponse } from "next/server";

// Proxy for protected routes (formerly middleware)
// Uses cookie-based session detection compatible with Auth.js
export async function proxy(request: NextRequest) {
  // Check for any Auth.js session indicator
  const sessionToken = 
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("__Host-authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value ||
    request.cookies.get("__Host-next-auth.session-token")?.value;
  
  const hasSession = !!sessionToken;

  // Protected routes require authentication
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith("/app") || 
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname === "/onboarding" ||
    request.nextUrl.pathname.startsWith("/api/onboarding");

  if (isProtectedRoute) {
    if (!hasSession) {
      const signinUrl = new URL("/auth/signin", request.url);
      signinUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(signinUrl);
    }

    // Admin-only routes: check role from session token
    if (request.nextUrl.pathname.startsWith("/admin")) {
      // Try to decode role from session token (JWT)
      // Note: Full verification happens in the page, this is just a quick redirect
      try {
        const payload = JSON.parse(atob(sessionToken.split('.')[1]));
        const role = payload?.role;
        
        if (role !== "admin") {
          // Non-admin trying to access admin area -> redirect to /app
          return NextResponse.redirect(new URL("/app", request.url));
        }
      } catch {
        // If we can't decode, let the page handle it
        // (will show unauthorized or redirect)
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/dashboard/:path*", "/admin/:path*", "/onboarding"],
};
