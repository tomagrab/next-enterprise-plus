"use client";

import { ThemeProvider } from "@/components/providers/theme/theme-provider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        {children}
        <Toaster richColors position="top-right" />
      </SessionProvider>
    </ThemeProvider>
  );
}
