import { NextResponse } from "next/server";

export interface SecurityConfig {
  csp?: {
    enabled: boolean;
    reportOnly?: boolean;
    directives?: Record<string, string[]>;
  };
  hsts?: {
    enabled: boolean;
    maxAge?: number;
    includeSubDomains?: boolean;
    preload?: boolean;
  };
  frameOptions?: "DENY" | "SAMEORIGIN" | string;
  contentTypeOptions?: boolean;
  referrerPolicy?: string;
  permissionsPolicy?: Record<string, string[]>;
}

const defaultSecurityConfig: SecurityConfig = {
  csp: {
    enabled: true,
    reportOnly: process.env.NODE_ENV === "development",
    directives: {
      "default-src": ["'self'"],
      "script-src": [
        "'self'",
        "'unsafe-eval'", // NextAuth.js requires this for crypto operations
        "'unsafe-inline'", // Required for Next.js development
        process.env.NODE_ENV === "development" ? "'unsafe-eval'" : "",
      ].filter(Boolean),
      "style-src": ["'self'", "'unsafe-inline'"], // Tailwind requires unsafe-inline
      "img-src": ["'self'", "data:", "https:", "blob:"],
      "font-src": ["'self'", "data:"],
      "connect-src": [
        "'self'",
        "https://api.github.com", // For GitHub OAuth
        "https://accounts.google.com", // For Google OAuth
        "https://login.microsoftonline.com", // For Microsoft Entra ID
        process.env.NODE_ENV === "development" ? "ws://localhost:*" : "", // Hot reload
        process.env.NODE_ENV === "development" ? "http://localhost:*" : "",
      ].filter(Boolean),
      "frame-ancestors": ["'none'"],
      "base-uri": ["'self'"],
      "form-action": ["'self'"],
      "object-src": ["'none'"],
      "media-src": ["'self'"],
      "worker-src": ["'self'", "blob:"],
      "manifest-src": ["'self'"],
    },
  },
  hsts: {
    enabled: process.env.NODE_ENV === "production",
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  frameOptions: "DENY",
  contentTypeOptions: true,
  referrerPolicy: "strict-origin-when-cross-origin",
  permissionsPolicy: {
    accelerometer: ["'none'"],
    camera: ["'none'"],
    geolocation: ["'none'"],
    gyroscope: ["'none'"],
    magnetometer: ["'none'"],
    microphone: ["'none'"],
    payment: ["'none'"],
    usb: ["'none'"],
  },
};

export function applySecurityHeaders(
  response: NextResponse,
  config: SecurityConfig = defaultSecurityConfig
): NextResponse {
  // Content Security Policy
  if (config.csp?.enabled) {
    const cspDirectives = Object.entries(config.csp.directives || {})
      .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
      .join("; ");

    const cspHeader = config.csp.reportOnly
      ? "Content-Security-Policy-Report-Only"
      : "Content-Security-Policy";

    response.headers.set(cspHeader, cspDirectives);
  }

  // HTTP Strict Transport Security (HSTS)
  if (config.hsts?.enabled) {
    let hstsValue = `max-age=${config.hsts.maxAge || 31536000}`;
    if (config.hsts.includeSubDomains) hstsValue += "; includeSubDomains";
    if (config.hsts.preload) hstsValue += "; preload";
    response.headers.set("Strict-Transport-Security", hstsValue);
  }

  // X-Frame-Options
  if (config.frameOptions) {
    response.headers.set("X-Frame-Options", config.frameOptions);
  }

  // X-Content-Type-Options
  if (config.contentTypeOptions) {
    response.headers.set("X-Content-Type-Options", "nosniff");
  }

  // Referrer Policy
  if (config.referrerPolicy) {
    response.headers.set("Referrer-Policy", config.referrerPolicy);
  }

  // Permissions Policy
  if (config.permissionsPolicy) {
    const permissionsValue = Object.entries(config.permissionsPolicy)
      .map(([directive, allowlist]) => `${directive}=(${allowlist.join(" ")})`)
      .join(", ");
    response.headers.set("Permissions-Policy", permissionsValue);
  }

  // Additional security headers
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("X-Download-Options", "noopen");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");

  // Remove server identification
  response.headers.delete("Server");
  response.headers.delete("X-Powered-By");

  return response;
}

// Utility to create CSP nonce for inline scripts
export function generateCSPNonce(): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString(
    "base64"
  );
}

// Custom security config for different environments
export const securityConfigs = {
  development: {
    csp: {
      enabled: true,
      reportOnly: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": [
          "'self'",
          "'unsafe-eval'",
          "'unsafe-inline'",
          "webpack://",
        ],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "https:", "blob:"],
        "font-src": ["'self'", "data:"],
        "connect-src": [
          "'self'",
          "ws://localhost:*",
          "http://localhost:*",
          "https://api.github.com",
          "https://accounts.google.com",
          "https://login.microsoftonline.com",
        ],
        "frame-ancestors": ["'none'"],
        "base-uri": ["'self'"],
        "form-action": ["'self'"],
        "object-src": ["'none'"],
        "media-src": ["'self'"],
        "worker-src": ["'self'", "blob:"],
        "manifest-src": ["'self'"],
      },
    },
    hsts: {
      enabled: false,
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    frameOptions: "DENY" as const,
    contentTypeOptions: true,
    referrerPolicy: "strict-origin-when-cross-origin",
    permissionsPolicy: {
      accelerometer: ["'none'"],
      camera: ["'none'"],
      geolocation: ["'none'"],
      gyroscope: ["'none'"],
      magnetometer: ["'none'"],
      microphone: ["'none'"],
      payment: ["'none'"],
      usb: ["'none'"],
    },
  },
  production: {
    csp: {
      enabled: true,
      reportOnly: false,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "'unsafe-eval'"], // NextAuth.js requirement
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "https:", "blob:"],
        "font-src": ["'self'", "data:"],
        "connect-src": [
          "'self'",
          "https://api.github.com",
          "https://accounts.google.com",
          "https://login.microsoftonline.com",
        ],
        "frame-ancestors": ["'none'"],
        "base-uri": ["'self'"],
        "form-action": ["'self'"],
        "object-src": ["'none'"],
        "media-src": ["'self'"],
        "worker-src": ["'self'", "blob:"],
        "manifest-src": ["'self'"],
        "upgrade-insecure-requests": [],
      },
    },
    hsts: {
      enabled: true,
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    frameOptions: "DENY" as const,
    contentTypeOptions: true,
    referrerPolicy: "strict-origin-when-cross-origin",
    permissionsPolicy: {
      accelerometer: ["'none'"],
      camera: ["'none'"],
      geolocation: ["'none'"],
      gyroscope: ["'none'"],
      magnetometer: ["'none'"],
      microphone: ["'none'"],
      payment: ["'none'"],
      usb: ["'none'"],
    },
  },
} as const;

export default defaultSecurityConfig;
