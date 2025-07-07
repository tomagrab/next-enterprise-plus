import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import {
  applySecurityHeaders,
  securityConfigs,
  type SecurityConfig,
} from "@/lib/security/headers";
import { rateLimit, rateLimitConfigs } from "@/lib/security/rate-limit";
import { csrfProtection, setCSRFToken } from "@/lib/security/csrf";

// Rate limiters for different endpoint types
const authRateLimit = rateLimit(rateLimitConfigs.auth);
const apiRateLimit = rateLimit(rateLimitConfigs.api);
const defaultRateLimit = rateLimit(rateLimitConfigs.default);

// CSRF protection instance
const csrf = csrfProtection();

// Main middleware function
async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Apply rate limiting based on path
  let rateLimitResult = null;

  if (pathname.startsWith("/api/auth/")) {
    rateLimitResult = authRateLimit(request);
  } else if (pathname.startsWith("/api/")) {
    rateLimitResult = apiRateLimit(request);
  } else {
    rateLimitResult = defaultRateLimit(request);
  }

  if (rateLimitResult) {
    return rateLimitResult; // Return rate limit response
  }

  // Apply CSRF protection for non-API routes and sensitive API routes
  if (
    !pathname.startsWith("/api/auth/") &&
    (request.method !== "GET" || pathname.startsWith("/api/"))
  ) {
    const csrfResult = await csrf(request);
    if (csrfResult) {
      return csrfResult; // Return CSRF error response
    }
  }

  // Apply security headers
  const securityConfig =
    process.env.NODE_ENV === "production"
      ? (securityConfigs.production as unknown as SecurityConfig)
      : (securityConfigs.development as unknown as SecurityConfig);

  const secureResponse = applySecurityHeaders(response, securityConfig);

  // Set CSRF token for GET requests (so it's available for subsequent requests)
  if (request.method === "GET" && !pathname.startsWith("/api/")) {
    await setCSRFToken(secureResponse);
  }

  return secureResponse;
}

// Wrap with NextAuth middleware for authentication
export default withAuth(middleware, {
  callbacks: {
    authorized: ({ req }) => {
      const pathname = req.nextUrl.pathname;

      // Public routes that don't require authentication
      const publicRoutes = [
        "/",
        "/auth/signin",
        "/auth/signup",
        "/auth/error",
        "/api/auth/",
        "/not-found",
        "/error",
      ];

      // Allow public routes
      if (publicRoutes.some((route) => pathname.startsWith(route))) {
        return true;
      }

      // For demo purposes, allow all routes
      // In production, implement proper authorization logic:
      // return !!token && hasPermission(token, pathname);
      return true;
    },
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg)$).*)",
  ],
};
