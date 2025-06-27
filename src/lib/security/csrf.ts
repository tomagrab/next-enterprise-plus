import { NextRequest, NextResponse } from "next/server";

export interface CSRFConfig {
  secret: string;
  tokenLength?: number;
  cookieName?: string;
  headerName?: string;
  formFieldName?: string;
  sameSite?: "strict" | "lax" | "none";
  secure?: boolean;
  httpOnly?: boolean;
  maxAge?: number;
}

const defaultConfig: Required<CSRFConfig> = {
  secret: process.env.NEXTAUTH_SECRET || "default-csrf-secret",
  tokenLength: 32,
  cookieName: "csrf-token",
  headerName: "x-csrf-token",
  formFieldName: "_csrf",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  httpOnly: false, // Must be false so client can read it
  maxAge: 60 * 60 * 24, // 24 hours
};

// Safe HTTP methods that don't require CSRF protection
const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];

// Generate a cryptographically secure random token
export function generateCSRFToken(length: number = 32): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

// Create HMAC signature for token verification
async function createTokenSignature(
  token: string,
  secret: string
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(token)
  );
  return Array.from(new Uint8Array(signature), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

// Verify token signature
async function verifyTokenSignature(
  token: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const expectedSignature = await createTokenSignature(token, secret);
  return timingSafeEqual(signature, expectedSignature);
}

// Timing-safe string comparison
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

// Create signed CSRF token
export async function createSignedCSRFToken(
  config: CSRFConfig = defaultConfig
): Promise<string> {
  const mergedConfig = { ...defaultConfig, ...config };
  const token = generateCSRFToken(mergedConfig.tokenLength);
  const signature = await createTokenSignature(token, mergedConfig.secret);
  return `${token}.${signature}`;
}

// Verify signed CSRF token
export async function verifySignedCSRFToken(
  signedToken: string,
  config: CSRFConfig = defaultConfig
): Promise<boolean> {
  const mergedConfig = { ...defaultConfig, ...config };
  const parts = signedToken.split(".");

  if (parts.length !== 2) {
    return false;
  }

  const [token, signature] = parts;
  return await verifyTokenSignature(token, signature, mergedConfig.secret);
}

// Extract CSRF token from request
function extractCSRFToken(
  request: NextRequest,
  config: Required<CSRFConfig>
): string | null {
  // Check header first
  const headerToken = request.headers.get(config.headerName);
  if (headerToken) {
    return headerToken;
  }

  // Check form data for POST requests
  if (request.method === "POST") {
    const contentType = request.headers.get("content-type");
    if (contentType?.includes("application/x-www-form-urlencoded")) {
      // Note: This would need to be extracted from the body in a real implementation
      // For now, we'll rely on header and cookie validation
    }
  }

  return null;
}

// CSRF protection middleware
export function csrfProtection(config: Partial<CSRFConfig> = {}) {
  const mergedConfig = { ...defaultConfig, ...config };

  return async (request: NextRequest): Promise<NextResponse | null> => {
    // Skip CSRF protection for safe methods
    if (SAFE_METHODS.includes(request.method)) {
      return null;
    }

    // Skip CSRF protection for API routes that use other authentication
    const pathname = new URL(request.url).pathname;
    if (pathname.startsWith("/api/auth/")) {
      return null; // NextAuth handles its own CSRF protection
    }

    // Get the expected token from cookie
    const expectedToken = request.cookies.get(mergedConfig.cookieName)?.value;

    if (!expectedToken) {
      return NextResponse.json(
        {
          error: {
            message: "CSRF token missing",
            code: "CSRF_TOKEN_MISSING",
            statusCode: 403,
          },
        },
        { status: 403 }
      );
    }

    // Get the provided token from request
    const providedToken = extractCSRFToken(request, mergedConfig);

    if (!providedToken) {
      return NextResponse.json(
        {
          error: {
            message: "CSRF token required",
            code: "CSRF_TOKEN_REQUIRED",
            statusCode: 403,
          },
        },
        { status: 403 }
      );
    }

    // Verify tokens match and are valid
    const isValidExpected = await verifySignedCSRFToken(
      expectedToken,
      mergedConfig
    );
    const isValidProvided = await verifySignedCSRFToken(
      providedToken,
      mergedConfig
    );

    if (
      !isValidExpected ||
      !isValidProvided ||
      !timingSafeEqual(expectedToken, providedToken)
    ) {
      return NextResponse.json(
        {
          error: {
            message: "Invalid CSRF token",
            code: "CSRF_TOKEN_INVALID",
            statusCode: 403,
          },
        },
        { status: 403 }
      );
    }

    return null; // Allow request
  };
}

// Generate and set CSRF token in response
export async function setCSRFToken(
  response: NextResponse,
  config: Partial<CSRFConfig> = {}
): Promise<NextResponse> {
  const mergedConfig = { ...defaultConfig, ...config };
  const token = await createSignedCSRFToken(mergedConfig);

  // Set cookie
  response.cookies.set(mergedConfig.cookieName, token, {
    httpOnly: mergedConfig.httpOnly,
    secure: mergedConfig.secure,
    sameSite: mergedConfig.sameSite,
    maxAge: mergedConfig.maxAge,
    path: "/",
  });

  // Also set as header for easy client access
  response.headers.set(`X-${mergedConfig.headerName}`, token);

  return response;
}

// React hook for CSRF token (client-side)
export function useCSRFToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  // Try to get from cookie
  const cookies = document.cookie.split(";");
  const csrfCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${defaultConfig.cookieName}=`)
  );

  if (csrfCookie) {
    return csrfCookie.split("=")[1];
  }

  // Try to get from meta tag (if set in layout)
  const metaTag = document.querySelector(
    'meta[name="csrf-token"]'
  ) as HTMLMetaElement;
  return metaTag?.content || null;
}

// Utility to add CSRF token to fetch requests
export function withCSRFToken(init: RequestInit = {}): RequestInit {
  // Helper function to get token from cookie
  function getCSRFTokenFromCookie(): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    const cookies = document.cookie.split(";");
    const csrfCookie = cookies.find((cookie) =>
      cookie.trim().startsWith(`${defaultConfig.cookieName}=`)
    );

    if (csrfCookie) {
      return csrfCookie.split("=")[1];
    }

    const metaTag = document.querySelector(
      'meta[name="csrf-token"]'
    ) as HTMLMetaElement;
    return metaTag?.content || null;
  }

  const token = getCSRFTokenFromCookie();

  if (!token) {
    console.warn("CSRF token not found");
    return init;
  }

  return {
    ...init,
    headers: {
      ...init.headers,
      [defaultConfig.headerName]: token,
    },
  };
}

// Double Submit Cookie pattern for stateless CSRF protection
export class DoubleSubmitCSRF {
  private config: Required<CSRFConfig>;

  constructor(config: Partial<CSRFConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  async generateToken(): Promise<string> {
    return generateCSRFToken(this.config.tokenLength);
  }

  setTokenCookie(response: NextResponse, token: string): void {
    response.cookies.set(this.config.cookieName, token, {
      httpOnly: false, // Must be readable by client
      secure: this.config.secure,
      sameSite: this.config.sameSite,
      maxAge: this.config.maxAge,
      path: "/",
    });
  }

  validateRequest(request: NextRequest): boolean {
    if (SAFE_METHODS.includes(request.method)) {
      return true;
    }

    const cookieToken = request.cookies.get(this.config.cookieName)?.value;
    const headerToken = request.headers.get(this.config.headerName);

    return !!(
      cookieToken &&
      headerToken &&
      timingSafeEqual(cookieToken, headerToken)
    );
  }
}

export default csrfProtection;
