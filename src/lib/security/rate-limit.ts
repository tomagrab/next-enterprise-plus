import { NextRequest, NextResponse } from "next/server";

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (request: NextRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  message?: string;
  statusCode?: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Default configurations for different endpoints
export const rateLimitConfigs = {
  default: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: "Too many requests, please try again later",
    statusCode: 429,
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // Strict limit for auth endpoints
    message: "Too many authentication attempts, please try again later",
    statusCode: 429,
  },
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 1 request per second average
    message: "API rate limit exceeded",
    statusCode: 429,
  },
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10, // Very restrictive for uploads
    message: "Upload limit exceeded, please try again later",
    statusCode: 429,
  },
} as const;

function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback - in development this might be undefined
  const url = new URL(request.url);
  return url.hostname || "anonymous";
}

function defaultKeyGenerator(request: NextRequest): string {
  const ip = getClientIP(request);
  const path = new URL(request.url).pathname;
  return `ratelimit:${ip}:${path}`;
}

export function rateLimit(config: RateLimitConfig) {
  return (request: NextRequest): NextResponse | null => {
    const now = Date.now();
    const key = config.keyGenerator
      ? config.keyGenerator(request)
      : defaultKeyGenerator(request);

    // Clean up expired entries periodically
    cleanupExpiredEntries(now);

    const entry = rateLimitStore.get(key);
    const windowStart = now - config.windowMs;

    if (!entry || entry.resetTime <= windowStart) {
      // First request in window or expired entry
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return null; // Allow request
    }

    if (entry.count >= config.maxRequests) {
      // Rate limit exceeded
      const resetTime = entry.resetTime;
      const retryAfter = Math.ceil((resetTime - now) / 1000);

      const response = NextResponse.json(
        {
          error: {
            message: config.message || "Too many requests",
            code: "RATE_LIMIT_EXCEEDED",
            statusCode: config.statusCode || 429,
            retryAfter: retryAfter,
          },
        },
        { status: config.statusCode || 429 }
      );

      response.headers.set("Retry-After", retryAfter.toString());
      response.headers.set("X-RateLimit-Limit", config.maxRequests.toString());
      response.headers.set("X-RateLimit-Remaining", "0");
      response.headers.set(
        "X-RateLimit-Reset",
        Math.ceil(resetTime / 1000).toString()
      );

      return response;
    }

    // Increment counter
    entry.count += 1;
    rateLimitStore.set(key, entry);

    return null; // Allow request
  };
}

function cleanupExpiredEntries(now: number): void {
  // Clean up expired entries every 1000 requests to prevent memory leaks
  if (rateLimitStore.size > 1000) {
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime <= now) {
        rateLimitStore.delete(key);
      }
    }
  }
}

// Specific rate limiters for common use cases
export const authRateLimit = rateLimit(rateLimitConfigs.auth);
export const apiRateLimit = rateLimit(rateLimitConfigs.api);
export const uploadRateLimit = rateLimit(rateLimitConfigs.upload);
export const defaultRateLimit = rateLimit(rateLimitConfigs.default);

// Advanced rate limiter with multiple tiers
export function createTieredRateLimit(tiers: RateLimitConfig[]) {
  const limiters = tiers.map((config) => rateLimit(config));

  return (request: NextRequest): NextResponse | null => {
    for (const limiter of limiters) {
      const result = limiter(request);
      if (result) {
        return result; // Return first rate limit that triggers
      }
    }
    return null; // All tiers passed
  };
}

// Rate limiter with sliding window (more accurate but more memory intensive)
export class SlidingWindowRateLimit {
  private requests = new Map<string, number[]>();

  constructor(
    private windowMs: number,
    private maxRequests: number,
    private keyGenerator: (request: NextRequest) => string = defaultKeyGenerator
  ) {}

  check(request: NextRequest): NextResponse | null {
    const now = Date.now();
    const key = this.keyGenerator(request);
    const windowStart = now - this.windowMs;

    // Get existing requests for this key
    let requests = this.requests.get(key) || [];

    // Filter out requests outside the window
    requests = requests.filter((timestamp) => timestamp > windowStart);

    if (requests.length >= this.maxRequests) {
      const resetTime = requests[0] + this.windowMs;
      const retryAfter = Math.ceil((resetTime - now) / 1000);

      return NextResponse.json(
        {
          error: {
            message: "Rate limit exceeded",
            code: "RATE_LIMIT_EXCEEDED",
            statusCode: 429,
            retryAfter: retryAfter,
          },
        },
        { status: 429 }
      );
    }

    // Add current request
    requests.push(now);
    this.requests.set(key, requests);

    // Cleanup old entries periodically
    if (this.requests.size > 1000) {
      this.cleanup(windowStart);
    }

    return null;
  }

  private cleanup(windowStart: number): void {
    for (const [key, requests] of this.requests.entries()) {
      const validRequests = requests.filter(
        (timestamp) => timestamp > windowStart
      );
      if (validRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validRequests);
      }
    }
  }
}
