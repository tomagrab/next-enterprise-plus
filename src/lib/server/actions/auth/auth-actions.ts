"use server";

import { redirect } from "next/navigation";
import {
  withServerActionErrorHandling,
  ServerActionResult,
  createErrorResult,
  serverActionErrors,
} from "@/lib/errors/server-action-errors";

// Internal implementation for sign in
async function _signIn(provider: string): Promise<void> {
  // Validate provider
  if (!provider || typeof provider !== "string") {
    throw serverActionErrors.validation("Invalid provider specified");
  }

  // Validate provider against allowed list (optional - customize as needed)
  const allowedProviders = [
    "google",
    "github",
    "microsoft-entra-id",
    "credentials",
  ];
  if (!allowedProviders.includes(provider)) {
    throw serverActionErrors.validation(
      `Provider '${provider}' is not supported`
    );
  }

  try {
    // Redirect to NextAuth sign-in page with provider
    redirect(
      `/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent("/")}`
    );
  } catch (error) {
    // Check if this is a redirect (expected behavior)
    if (error && typeof error === "object" && "digest" in error) {
      const digest = (error as { digest?: string }).digest;
      if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) {
        // Re-throw redirect as it's expected behavior
        throw error;
      }
    }

    // Log non-redirect errors for monitoring
    console.error("Sign-in redirect failed:", error);
    throw serverActionErrors.internal("Failed to initiate sign-in process");
  }
}

// Internal implementation for sign out
async function _signOut(): Promise<void> {
  try {
    // Redirect to NextAuth sign-out endpoint
    redirect("/api/auth/signout");
  } catch (error) {
    // Check if this is a redirect (expected behavior)
    if (error && typeof error === "object" && "digest" in error) {
      const digest = (error as { digest?: string }).digest;
      if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) {
        // Re-throw redirect as it's expected behavior
        throw error;
      }
    }

    // Log non-redirect errors for monitoring
    console.error("Sign-out redirect failed:", error);
    throw serverActionErrors.internal("Failed to initiate sign-out process");
  }
}

// Public server action for sign in with error handling
export const signIn = withServerActionErrorHandling(_signIn, {
  allowRedirect: true, // Allow redirects to work normally
});

// Public server action for sign out with error handling
export const signOut = withServerActionErrorHandling(_signOut, {
  allowRedirect: true, // Allow redirects to work normally
});

// Alternative versions that return results instead of redirecting
// Useful for cases where you want to handle the result in the UI

export async function signInWithResult(
  provider: string
): Promise<ServerActionResult<{ redirectUrl: string }>> {
  try {
    if (!provider || typeof provider !== "string") {
      return createErrorResult<{ redirectUrl: string }>(
        "Invalid provider specified",
        "VALIDATION_ERROR"
      );
    }

    const allowedProviders = [
      "google",
      "github",
      "microsoft-entra-id",
      "credentials",
    ];
    if (!allowedProviders.includes(provider)) {
      return createErrorResult<{ redirectUrl: string }>(
        `Provider '${provider}' is not supported`,
        "VALIDATION_ERROR"
      );
    }

    // Instead of redirecting, return the URL for client-side navigation
    const signInUrl = `/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent(
      "/"
    )}`;
    return {
      success: true,
      data: { redirectUrl: signInUrl },
    };
  } catch (error) {
    console.error("Sign-in URL generation failed:", error);
    return createErrorResult<{ redirectUrl: string }>(
      "Failed to generate sign-in URL",
      "INTERNAL_SERVER_ERROR"
    );
  }
}

export async function signOutWithResult(): Promise<
  ServerActionResult<{ redirectUrl: string }>
> {
  try {
    const signOutUrl = "/api/auth/signout";
    return {
      success: true,
      data: { redirectUrl: signOutUrl },
    };
  } catch (error) {
    console.error("Sign-out URL generation failed:", error);
    return createErrorResult<{ redirectUrl: string }>(
      "Failed to generate sign-out URL",
      "INTERNAL_SERVER_ERROR"
    );
  }
}
