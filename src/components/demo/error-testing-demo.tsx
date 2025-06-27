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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { safeFetch, useErrorHandler } from "@/lib/errors/client-errors";
import { Separator } from "@/components/ui/separator";

export function ErrorTestingDemo() {
  const [results, setResults] = useState<Record<string, string>>({});
  const { handleError, handleApiError } = useErrorHandler();

  const tests = [
    {
      name: "React Error",
      description: "Throws a runtime React error",
      action: () => {
        throw new Error("This is a test React error");
      },
    },
    {
      name: "API 404 Error",
      description: "Tests API not found error handling",
      action: async () => {
        const { error } = await safeFetch("/api/example/user?id=404");
        if (error) {
          handleApiError(error);
          setResults((prev) => ({ ...prev, "api-404": "404 error handled" }));
        }
      },
    },
    {
      name: "API 403 Error",
      description: "Tests API forbidden error handling",
      action: async () => {
        const { error } = await safeFetch("/api/example/user?id=403");
        if (error) {
          handleApiError(error);
          setResults((prev) => ({ ...prev, "api-403": "403 error handled" }));
        }
      },
    },
    {
      name: "API 500 Error",
      description: "Tests API server error handling",
      action: async () => {
        const { error } = await safeFetch("/api/example/user?id=500");
        if (error) {
          handleApiError(error);
          setResults((prev) => ({ ...prev, "api-500": "500 error handled" }));
        }
      },
    },
    {
      name: "Network Error",
      description: "Simulates a network connectivity error",
      action: async () => {
        const { error } = await safeFetch("/api/nonexistent-endpoint");
        if (error) {
          handleApiError(error);
          setResults((prev) => ({ ...prev, network: "Network error handled" }));
        }
      },
    },
    {
      name: "Custom Error",
      description: "Tests custom error handling",
      action: () => {
        handleError("This is a custom error message", {
          context: "error-testing-demo",
          timestamp: new Date().toISOString(),
        });
        setResults((prev) => ({ ...prev, custom: "Custom error handled" }));
      },
    },
  ];

  const handleTest = async (test: (typeof tests)[0], index: number) => {
    try {
      setResults((prev) => ({ ...prev, [`test-${index}`]: "Running..." }));
      await test.action();
      setResults((prev) => ({ ...prev, [`test-${index}`]: "Completed" }));
    } catch (error) {
      handleError(error as Error, { testName: test.name });
      setResults((prev) => ({ ...prev, [`test-${index}`]: "Error caught" }));
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 Error Handling Tests
          <Badge variant="secondary">Development Only</Badge>
        </CardTitle>
        <CardDescription>
          Test different error scenarios to verify error handling is working
          correctly. Check browser console and toast notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            These tests will trigger actual errors to demonstrate the error
            handling system. Check the browser console for logged errors and
            watch for toast notifications.
          </AlertDescription>
        </Alert>

        <Separator />

        <div className="grid gap-3">
          {tests.map((test, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-medium text-sm">{test.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {test.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {results[`test-${index}`] && (
                  <Badge variant="outline" className="text-xs">
                    {results[`test-${index}`]}
                  </Badge>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTest(test, index)}
                >
                  Test
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            <strong>What to check:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Toast notifications appear for each error type</li>
            <li>Console logs show detailed error information</li>
            <li>Error boundaries catch React component errors</li>
            <li>API errors are properly formatted and handled</li>
          </ul>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setResults({})}
          className="w-full"
        >
          Clear Results
        </Button>
      </CardContent>
    </Card>
  );
}
