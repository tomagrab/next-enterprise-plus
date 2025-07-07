"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import type {
  FeatureFlagProvider as IFeatureFlagProvider,
  FeatureFlagContext,
} from "./types";

interface FeatureFlagContextValue {
  isEnabled: (flagKey: string) => boolean;
  getAllFlags: () => Record<string, boolean>;
  isLoading: boolean;
  error: string | null;
  refreshFlags: () => Promise<void>;
}

const FeatureFlagReactContext = createContext<FeatureFlagContextValue | null>(
  null
);

interface FeatureFlagProviderProps {
  children: ReactNode;
  provider: IFeatureFlagProvider;
  context?: FeatureFlagContext;
  refreshIntervalMs?: number;
}

export function FeatureFlagProvider({
  children,
  provider,
  context,
  refreshIntervalMs = 900000, // 15 minutes default - balances freshness with efficiency
}: FeatureFlagProviderProps) {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshFlags = useCallback(async () => {
    try {
      setError(null);
      const newFlags = await provider.getAllFlags(context);
      setFlags(newFlags);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to refresh feature flags";
      setError(errorMessage);
      console.error("Feature flags refresh error:", err);
    }
  }, [provider, context]);

  useEffect(() => {
    const initializeProvider = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await provider.initialize();
        await refreshFlags();
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to initialize feature flags";
        setError(errorMessage);
        console.error("Feature flags initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeProvider();

    // Set up refresh interval
    let intervalId: NodeJS.Timeout | null = null;
    if (refreshIntervalMs > 0) {
      intervalId = setInterval(refreshFlags, refreshIntervalMs);
    }

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (provider.cleanup) {
        provider.cleanup();
      }
    };
  }, [provider, refreshFlags, refreshIntervalMs]);

  const isEnabled = (flagKey: string): boolean => {
    return flags[flagKey] ?? false;
  };

  const getAllFlags = (): Record<string, boolean> => {
    return { ...flags };
  };

  const contextValue: FeatureFlagContextValue = {
    isEnabled,
    getAllFlags,
    isLoading,
    error,
    refreshFlags,
  };

  return (
    <FeatureFlagReactContext.Provider value={contextValue}>
      {children}
    </FeatureFlagReactContext.Provider>
  );
}

export function useFeatureFlags(): FeatureFlagContextValue {
  const context = useContext(FeatureFlagReactContext);

  if (!context) {
    throw new Error(
      "useFeatureFlags must be used within a FeatureFlagProvider"
    );
  }

  return context;
}

export function useFeatureFlag(flagKey: string): boolean {
  const { isEnabled } = useFeatureFlags();
  return isEnabled(flagKey);
}
