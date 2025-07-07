"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import {
  signInWithResult,
  signOutWithResult,
} from "@/lib/server/actions/auth/auth-actions";
import { ServerActionResult } from "@/lib/errors/server-action-errors";

export default function ServerActionDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<ServerActionResult<{
    redirectUrl: string;
  }> | null>(null);

  const handleSignInWithResult = async (provider: string) => {
    setIsLoading(true);
    try {
      const result = await signInWithResult(provider);
      setLastResult(result);

      if (result.success && result.data?.redirectUrl) {
        // In a real app, you might want to navigate to the URL
        console.log("Would redirect to:", result.data.redirectUrl);
      }
    } catch (error) {
      console.error("Action failed:", error);
      setLastResult({
        success: false,
        error: {
          message: "Unexpected error occurred",
          code: "UNKNOWN_ERROR",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOutWithResult = async () => {
    setIsLoading(true);
    try {
      const result = await signOutWithResult();
      setLastResult(result);

      if (result.success && result.data?.redirectUrl) {
        console.log("Would redirect to:", result.data.redirectUrl);
      }
    } catch (error) {
      console.error("Action failed:", error);
      setLastResult({
        success: false,
        error: {
          message: "Unexpected error occurred",
          code: "UNKNOWN_ERROR",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvalidProvider = () => {
    handleSignInWithResult("invalid-provider");
  };

  const clearResult = () => {
    setLastResult(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Server Action Error Handling Demo
          </CardTitle>
          <CardDescription>
            Test server actions with robust error handling, validation, and
            structured responses. These actions demonstrate proper error
            handling patterns for Next.js server actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Action Buttons */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Test Valid Actions:</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleSignInWithResult("google")}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                Sign In with Google
              </Button>
              <Button
                onClick={() => handleSignInWithResult("github")}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                Sign In with GitHub
              </Button>
              <Button
                onClick={() => handleSignInWithResult("microsoft-entra-id")}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                Sign In with Microsoft Entra ID
              </Button>
              <Button
                onClick={handleSignOutWithResult}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                Sign Out
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Test Error Handling:</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleInvalidProvider}
                disabled={isLoading}
                variant="destructive"
                size="sm"
              >
                Invalid Provider (Error Test)
              </Button>
              <Button
                onClick={() => handleSignInWithResult("")}
                disabled={isLoading}
                variant="destructive"
                size="sm"
              >
                Empty Provider (Validation Error)
              </Button>
            </div>
          </div>

          {/* Result Display */}
          {lastResult && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Last Action Result:</h4>
                <Button onClick={clearResult} variant="ghost" size="sm">
                  Clear
                </Button>
              </div>
              <Card
                className={
                  lastResult.success ? "border-green-200" : "border-red-200"
                }
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2">
                    {lastResult.success ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            lastResult.success ? "default" : "destructive"
                          }
                        >
                          {lastResult.success ? "Success" : "Error"}
                        </Badge>
                        {!lastResult.success && lastResult.error && (
                          <Badge variant="outline">
                            {lastResult.error.code}
                          </Badge>
                        )}
                      </div>

                      {lastResult.success && lastResult.data ? (
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Would redirect to:{" "}
                            <code className="text-xs bg-muted px-1 py-0.5 rounded">
                              {lastResult.data.redirectUrl}
                            </code>
                          </p>
                        </div>
                      ) : (
                        lastResult.error && (
                          <p className="text-sm text-red-600">
                            {lastResult.error.message}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              Processing action...
            </div>
          )}

          {/* Usage Notes */}
          <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
            <p>
              <strong>Note:</strong> This demo uses result-returning versions of
              server actions that don&apos;t redirect.
            </p>
            <p>
              The regular <code>signIn()</code> and <code>signOut()</code>{" "}
              actions will redirect as expected.
            </p>
            <p>
              All actions include validation, error handling, and proper logging
              for monitoring.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
