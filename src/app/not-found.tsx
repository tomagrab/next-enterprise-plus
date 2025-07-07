"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Page not found</AlertTitle>
          <AlertDescription>
            The requested URL was not found on this server.
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
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
