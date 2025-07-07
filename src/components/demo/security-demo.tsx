"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Lock,
  Zap,
  Globe,
} from "lucide-react";
import { toast } from "sonner";

interface RateLimitResult {
  request: number;
  status: number;
  headers: {
    "x-ratelimit-limit": string | null;
    "x-ratelimit-remaining": string | null;
    "x-ratelimit-reset": string | null;
  };
}

interface SecurityHeaders {
  "content-security-policy": string | null;
  "strict-transport-security": string | null;
  "x-frame-options": string | null;
  "x-content-type-options": string | null;
  "referrer-policy": string | null;
  "permissions-policy": string | null;
}

interface TestResults {
  validation?: {
    status?: number;
    data?: unknown;
    error?: string;
  };
  rateLimit?: RateLimitResult[] | { error: string };
  headers?: SecurityHeaders | { error: string };
}

export function SecurityDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TestResults>({});

  // Test input validation
  const testValidation = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/secure/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          age: formData.get("age")
            ? parseInt(formData.get("age") as string)
            : undefined,
        }),
      });

      const data = await response.json();
      setResults((prev) => ({
        ...prev,
        validation: { status: response.status, data },
      }));

      if (response.ok) {
        toast.success("Validation test passed!");
      } else {
        toast.error(
          "Validation test failed: " + (data.message || "Unknown error")
        );
      }
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        validation: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }));
      toast.error("Validation test failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Test rate limiting
  const testRateLimit = async () => {
    setIsLoading(true);
    const results: RateLimitResult[] = [];

    try {
      // Make multiple rapid requests to trigger rate limiting
      for (let i = 0; i < 15; i++) {
        const response = await fetch("/api/secure/users", {
          method: "GET",
        });
        results.push({
          request: i + 1,
          status: response.status,
          headers: {
            "x-ratelimit-limit": response.headers.get("x-ratelimit-limit"),
            "x-ratelimit-remaining": response.headers.get(
              "x-ratelimit-remaining"
            ),
            "x-ratelimit-reset": response.headers.get("x-ratelimit-reset"),
          },
        });

        // Small delay to show progression
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      setResults((prev) => ({ ...prev, rateLimit: results }));
      toast.success("Rate limiting test completed!");
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        rateLimit: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }));
      toast.error("Rate limiting test failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Test security headers
  const testSecurityHeaders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(window.location.href);
      const headers = {
        "content-security-policy": response.headers.get(
          "content-security-policy"
        ),
        "strict-transport-security": response.headers.get(
          "strict-transport-security"
        ),
        "x-frame-options": response.headers.get("x-frame-options"),
        "x-content-type-options": response.headers.get(
          "x-content-type-options"
        ),
        "referrer-policy": response.headers.get("referrer-policy"),
        "permissions-policy": response.headers.get("permissions-policy"),
      };

      setResults((prev) => ({ ...prev, headers }));
      toast.success("Security headers test completed!");
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        headers: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }));
      toast.error("Security headers test failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security & Compliance Demo
        </CardTitle>
        <CardDescription>
          Test the security features including input validation, rate limiting,
          CSRF protection, and security headers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="validation" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="validation">
              <Lock className="h-4 w-4 mr-2" />
              Validation
            </TabsTrigger>
            <TabsTrigger value="ratelimit">
              <Zap className="h-4 w-4 mr-2" />
              Rate Limiting
            </TabsTrigger>
            <TabsTrigger value="headers">
              <Globe className="h-4 w-4 mr-2" />
              Security Headers
            </TabsTrigger>
            <TabsTrigger value="overview">
              <Shield className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="validation" className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This tests Zod schema validation. Try submitting invalid data to
                see validation errors.
              </AlertDescription>
            </Alert>

            <form action={testValidation} className="space-y-4">
              <div>
                <Label htmlFor="name">Name (required, min 2 chars)</Label>
                <Input id="name" name="name" placeholder="John Doe" />
              </div>
              <div>
                <Label htmlFor="email">Email (required, valid email)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="age">Age (optional, 13-120)</Label>
                <Input id="age" name="age" type="number" placeholder="25" />
              </div>
              <Button type="submit" disabled={isLoading}>
                Test Validation
              </Button>
            </form>

            {results.validation && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Validation Result:</h4>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(results.validation, null, 2)}
                </pre>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ratelimit" className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This tests rate limiting by making 15 rapid requests. You should
                see 429 errors after the limit is reached.
              </AlertDescription>
            </Alert>

            <Button onClick={testRateLimit} disabled={isLoading}>
              Test Rate Limiting (15 requests)
            </Button>

            {results.rateLimit && Array.isArray(results.rateLimit) && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">Rate Limit Results:</h4>
                <div className="grid gap-2 max-h-60 overflow-auto">
                  {results.rateLimit.map(
                    (result: RateLimitResult, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                      >
                        <span>Request {result.request}</span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              result.status === 200
                                ? "default"
                                : result.status === 429
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {result.status}
                          </Badge>
                          {result.headers["x-ratelimit-remaining"] && (
                            <span className="text-muted-foreground">
                              {result.headers["x-ratelimit-remaining"]} left
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="headers" className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This tests security headers applied by the middleware. Check the
                developer tools Network tab to see all headers.
              </AlertDescription>
            </Alert>

            <Button onClick={testSecurityHeaders} disabled={isLoading}>
              Test Security Headers
            </Button>

            {results.headers && !("error" in results.headers) && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">Security Headers:</h4>
                <div className="space-y-2">
                  {Object.entries(results.headers).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-start gap-2 p-2 bg-muted rounded text-sm"
                    >
                      <div className="font-medium min-w-0 flex-shrink-0 capitalize">
                        {key.replace(/-/g, " ")}:
                      </div>
                      <div className="flex-1 min-w-0">
                        {value ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="break-all">{String(value)}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <span className="text-muted-foreground">
                              Not set
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Input Validation
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="space-y-1">
                    <li>• Zod schema validation</li>
                    <li>• Type-safe input parsing</li>
                    <li>• Comprehensive error messages</li>
                    <li>• Server-side validation</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Rate Limiting
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="space-y-1">
                    <li>• In-memory rate limiting</li>
                    <li>• Different limits per endpoint type</li>
                    <li>• Standard rate limit headers</li>
                    <li>• Production-ready for Redis</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    CSRF Protection
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="space-y-1">
                    <li>• Double submit cookie pattern</li>
                    <li>• Automatic token generation</li>
                    <li>• Header and cookie validation</li>
                    <li>• Configurable for different environments</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Security Headers
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="space-y-1">
                    <li>• Content Security Policy (CSP)</li>
                    <li>• HSTS and frame protection</li>
                    <li>• Permissions and referrer policies</li>
                    <li>• Environment-specific configurations</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                All security features are configured in{" "}
                <code>src/lib/security/</code> and applied via middleware. The
                system is production-ready and follows security best practices.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
