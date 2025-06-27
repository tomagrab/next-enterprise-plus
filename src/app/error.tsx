"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to monitoring service
    console.error("Global error page:", error);

    // You can integrate with error monitoring services here
    // Example: Sentry.captureException(error);
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-destructive">500</h1>
          <h2 className="text-2xl font-semibold">Server Error</h2>
          <p className="text-muted-foreground">
            Something went wrong on our end. Please try again later.
          </p>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Application Error</AlertTitle>
          <AlertDescription>
            An unexpected error occurred. Our team has been notified.
            {error.digest && (
              <span className="block mt-1 text-xs">
                Error ID: {error.digest}
              </span>
            )}
          </AlertDescription>
        </Alert>

        {isDev && (
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium text-sm mb-2">
              Development Error Details:
            </h3>
            <pre className="text-xs text-muted-foreground overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={reset} variant="outline" className="flex-1">
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button asChild className="flex-1">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
