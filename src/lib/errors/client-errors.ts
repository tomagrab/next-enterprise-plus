import { toast } from "sonner";

export interface ClientError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
}

export class FetchError extends Error {
  public response: Response;
  public data?: unknown;

  constructor(message: string, response: Response, data?: unknown) {
    super(message);
    this.name = "FetchError";
    this.response = response;
    this.data = data;
  }
}

// Enhanced fetch with error handling
export async function safeFetch<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<{ data: T; error: null } | { data: null; error: ClientError }> {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      const error: ClientError = {
        message:
          (errorData as { error?: { message?: string } })?.error?.message ||
          response.statusText,
        code: (errorData as { error?: { code?: string } })?.error?.code,
        statusCode: response.status,
        details: errorData,
      };

      return { data: null, error };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error("Fetch error:", error);

    const clientError: ClientError = {
      message:
        error instanceof Error ? error.message : "Network error occurred",
      code: "NETWORK_ERROR",
      statusCode: 0,
    };

    return { data: null, error: clientError };
  }
}

// Error logging utility
export function logError(error: Error, context?: Record<string, unknown>) {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp: new Date().toISOString(),
    url: typeof window !== "undefined" ? window.location.href : undefined,
    userAgent:
      typeof window !== "undefined" ? window.navigator.userAgent : undefined,
    context,
  };

  console.error("Client Error:", errorInfo);

  // Send to monitoring service in production
  if (process.env.NODE_ENV === "production") {
    // Example: Send to your monitoring service
    // Sentry.captureException(error, { extra: errorInfo });
    // Or send to your own logging endpoint
    // fetch('/api/logs/client-error', {
    //   method: 'POST',
    //   body: JSON.stringify(errorInfo)
    // }).catch(() => {
    //   // Ignore logging errors
    // });
  }
}

// Error toast helpers
export const errorToast = {
  show: (error: ClientError | Error | string) => {
    const message =
      typeof error === "string"
        ? error
        : error instanceof Error
        ? error.message
        : error.message;

    toast.error(message, {
      description:
        typeof error === "object" && "code" in error && error.code
          ? `Error code: ${error.code}`
          : undefined,
    });
  },

  network: () => {
    toast.error("Network Error", {
      description: "Please check your internet connection and try again.",
    });
  },

  validation: (message = "Please check your input and try again") => {
    toast.error("Validation Error", {
      description: message,
    });
  },

  unauthorized: () => {
    toast.error("Authentication Required", {
      description: "Please sign in to continue.",
    });
  },

  forbidden: () => {
    toast.error("Access Denied", {
      description: "You don't have permission to perform this action.",
    });
  },

  notFound: (resource = "resource") => {
    toast.error("Not Found", {
      description: `The ${resource} you're looking for doesn't exist.`,
    });
  },

  serverError: () => {
    toast.error("Server Error", {
      description: "Something went wrong on our end. Please try again later.",
    });
  },
};

// React hook for error handling
export function useErrorHandler() {
  const handleError = (
    error: Error | ClientError | string,
    context?: Record<string, unknown>
  ) => {
    if (error instanceof Error) {
      logError(error, context);
    }
    errorToast.show(error);
  };

  const handleApiError = (error: ClientError) => {
    logError(new Error(error.message), { error });

    switch (error.statusCode) {
      case 401:
        errorToast.unauthorized();
        break;
      case 403:
        errorToast.forbidden();
        break;
      case 404:
        errorToast.notFound();
        break;
      case 422:
        errorToast.validation(error.message);
        break;
      case 500:
        errorToast.serverError();
        break;
      default:
        errorToast.show(error);
    }
  };

  return { handleError, handleApiError };
}
