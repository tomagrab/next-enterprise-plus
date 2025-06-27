import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth";

// Server-side session utility with error handling
export const getSession = async () => {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    console.error("Error getting server session:", error);
    // Log to monitoring service in production
    // Example: Sentry.captureException(error);
    return null;
  }
};

// Auth configuration export for components that need it
export { authOptions };
