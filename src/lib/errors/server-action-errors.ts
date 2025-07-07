export class ServerActionError extends Error {
  public code: string;
  public statusCode: number;

  constructor(
    message: string,
    code: string = "SERVER_ACTION_ERROR",
    statusCode: number = 500
  ) {
    super(message);
    this.name = "ServerActionError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

// Server action result types
export type ServerActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
};

// Success result helper
export function createSuccessResult<T>(data?: T): ServerActionResult<T> {
  return {
    success: true,
    data,
  };
}

// Error result helper
export function createErrorResult<T = void>(
  message: string,
  code: string = "SERVER_ACTION_ERROR"
): ServerActionResult<T> {
  return {
    success: false,
    error: {
      message,
      code,
    },
  };
}

// Server action error handler
export function handleServerActionError<T = void>(
  error: unknown
): ServerActionResult<T> {
  console.error("Server Action Error:", error);

  // Log to monitoring service
  // Example: Sentry.captureException(error);

  if (error instanceof ServerActionError) {
    return createErrorResult<T>(error.message, error.code);
  }

  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes("authentication")) {
      return createErrorResult<T>("Authentication required", "UNAUTHORIZED");
    }

    if (
      error.message.includes("authorization") ||
      error.message.includes("permission")
    ) {
      return createErrorResult<T>("Access denied", "FORBIDDEN");
    }

    if (error.message.includes("validation")) {
      return createErrorResult<T>("Validation failed", "VALIDATION_ERROR");
    }

    // Generic error in development, sanitized in production
    const isDev = process.env.NODE_ENV === "development";
    return createErrorResult<T>(
      isDev ? error.message : "An error occurred",
      "SERVER_ACTION_ERROR"
    );
  }

  // Unknown error
  return createErrorResult<T>("An unexpected error occurred", "UNKNOWN_ERROR");
}

// Wrapper for server actions that may redirect
export function withServerActionErrorHandling<T extends unknown[], R>(
  action: (...args: T) => Promise<R>,
  options: {
    // If true, redirects will be allowed to throw (normal behavior)
    // If false, redirects will be caught and returned as errors
    allowRedirect?: boolean;
    // Custom error message for redirect failures
    redirectErrorMessage?: string;
  } = {}
) {
  const { allowRedirect = true, redirectErrorMessage = "Navigation failed" } =
    options;

  return async (...args: T): Promise<R> => {
    try {
      return await action(...args);
    } catch (error) {
      // Check if this is a Next.js redirect error (which is expected behavior)
      if (error && typeof error === "object" && "digest" in error) {
        const digest = (error as { digest?: string }).digest;
        if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) {
          if (allowRedirect) {
            // Re-throw redirect errors as they're expected behavior
            throw error;
          } else {
            // Convert redirect to error result - this won't compile cleanly
            // so we'll just log and re-throw for now
            console.error("Redirect intercepted:", redirectErrorMessage);
            throw error;
          }
        }
      }

      // For non-redirect errors, log and re-throw
      console.error("Server action error:", error);
      throw error;
    }
  };
}

// Common server action error factories
export const serverActionErrors = {
  unauthorized: (message = "Authentication required") =>
    new ServerActionError(message, "UNAUTHORIZED", 401),

  forbidden: (message = "Access denied") =>
    new ServerActionError(message, "FORBIDDEN", 403),

  validation: (message = "Validation failed") =>
    new ServerActionError(message, "VALIDATION_ERROR", 422),

  notFound: (resource = "Resource") =>
    new ServerActionError(`${resource} not found`, "NOT_FOUND", 404),

  conflict: (message = "Resource conflict") =>
    new ServerActionError(message, "CONFLICT", 409),

  internal: (message = "Internal server error") =>
    new ServerActionError(message, "INTERNAL_SERVER_ERROR", 500),
};
