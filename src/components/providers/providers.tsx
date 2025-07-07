"use client";

import { ThemeProvider } from "@/components/providers/theme/theme-provider";
import { ColorThemeProvider } from "@/components/providers/theme/color-theme-provider";
import { FeatureFlagProvider } from "@/lib/feature-flags/context";
import { LocalFeatureFlagProvider } from "@/lib/feature-flags/providers/local";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Initialize the local feature flag provider
  const featureFlagProvider = new LocalFeatureFlagProvider();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ColorThemeProvider defaultTheme="blue">
        <FeatureFlagProvider provider={featureFlagProvider}>
          <SessionProvider>
            {children}
            <Toaster richColors position="top-right" />
          </SessionProvider>
        </FeatureFlagProvider>
      </ColorThemeProvider>
    </ThemeProvider>
  );
}
