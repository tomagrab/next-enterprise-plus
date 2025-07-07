import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code || this.getDefaultCode(statusCode);
  }

  private getDefaultCode(statusCode: number): string {
    switch (statusCode) {
      case 400: return "BAD_REQUEST";
      case 401: return "UNAUTHORIZED";
      case 403: return "FORBIDDEN";
      case 404: return "NOT_FOUND";
      case 409: return "CONFLICT";
      case 422: return "VALIDATION_ERROR";
      case 429: return "TOO_MANY_REQUESTS";
      case 500: return "INTERNAL_SERVER_ERROR";
      default: return "UNKNOWN_ERROR";
    }
  }
}

export function createApiError(
  message: string,
  statusCode: number = 500,
  code?: string
): ApiError {
  return new ApiError(message, statusCode, code);
}

export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);

  // Log to monitoring service
  // Example: Sentry.captureException(error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
        },
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          statusCode: 422,
          details: error.errors,
        },
      },
      { status: 422 }
    );
  }

  // Handle authentication errors
  if (error instanceof Error && error.message.includes("authentication")) {
    return NextResponse.json(
      {
        error: {
          message: "Authentication required",
          code: "UNAUTHORIZED",
          statusCode: 401,
        },
      },
      { status: 401 }
    );
  }

  // Generic error fallback
  const isDev = process.env.NODE_ENV === "development";
  return NextResponse.json(
    {
      error: {
        message: isDev ? (error as Error)?.message || "Unknown error" : "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
        statusCode: 500,
        ...(isDev && { stack: (error as Error)?.stack }),
      },
    },
    { status: 500 }
  );
}

// Wrapper for API route handlers
export function withErrorHandler<T extends unknown[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

// Common error factories
export const errors = {
  notFound: (resource = "Resource") => 
    new ApiError(`${resource} not found`, 404, "NOT_FOUND"),
  
  unauthorized: (message = "Authentication required") => 
    new ApiError(message, 401, "UNAUTHORIZED"),
  
  forbidden: (message = "Access denied") => 
    new ApiError(message, 403, "FORBIDDEN"),
  
  badRequest: (message = "Invalid request") => 
    new ApiError(message, 400, "BAD_REQUEST"),
  
  validation: (message = "Validation failed") => 
    new ApiError(message, 422, "VALIDATION_ERROR"),
  
  conflict: (message = "Resource conflict") => 
    new ApiError(message, 409, "CONFLICT"),
  
  rateLimited: (message = "Too many requests") => 
    new ApiError(message, 429, "TOO_MANY_REQUESTS"),
  
  internal: (message = "Internal server error") => 
    new ApiError(message, 500, "INTERNAL_SERVER_ERROR"),
};
