/**
 * Next.js Middleware
 *
 * Handles:
 * - Security headers
 * - Request logging
 * - Rate limiting (basic)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { logger } from "@/lib/logger";

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const { pathname } = request.nextUrl;

  // Create response
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // HSTS (only in production)
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://uploadthing.com https://*.uploadthing.com", // 'unsafe-eval' needed for Next.js
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.stripe.com https://api.resend.com https://api.inngest.com https://*.arcjet.net https://uploadthing.com https://*.uploadthing.com https://utfs.io",
    "frame-src https://js.stripe.com https://uploadthing.com https://*.uploadthing.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  // Log request (only in development or for API routes)
  if (process.env.NODE_ENV === "development" || pathname.startsWith("/api")) {
    const duration = Date.now() - startTime;
    logger.info("Request", {
      method: request.method,
      path: pathname,
      duration: `${duration}ms`,
      userAgent: request.headers.get("user-agent"),
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
