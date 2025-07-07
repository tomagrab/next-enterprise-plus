import type {
  FeatureFlagProvider,
  FeatureFlagConfig,
  FeatureFlagContext,
  FeatureFlag,
} from "./types";
import { LocalFeatureFlagProvider } from "./providers/local";

/**
 * Feature Flag Manager
 * Handles initialization and configuration of feature flag providers
 */
export class FeatureFlagManager {
  private provider: FeatureFlagProvider | null = null;
  private config: FeatureFlagConfig;
  private defaultContext?: FeatureFlagContext;

  constructor(config: FeatureFlagConfig, defaultContext?: FeatureFlagContext) {
    this.config = config;
    this.defaultContext = defaultContext;
  }

  /**
   * Initialize the feature flag provider based on configuration
   */
  async initialize(): Promise<FeatureFlagProvider> {
    if (this.provider) {
      return this.provider;
    }

    switch (this.config.provider) {
      case "local":
        this.provider = new LocalFeatureFlagProvider(
          this.config.localFlags || {},
          this.config.enableLogging || false
        );
        break;

      case "launchdarkly":
        // Future implementation - could import dynamically
        throw new Error(
          'LaunchDarkly provider not implemented yet. Use "local" provider or implement LaunchDarkly integration.'
        );

      case "splitio":
        // Future implementation - could import dynamically
        throw new Error(
          'Split.io provider not implemented yet. Use "local" provider or implement Split.io integration.'
        );

      case "configcat":
        // Future implementation - could import dynamically
        throw new Error(
          'ConfigCat provider not implemented yet. Use "local" provider or implement ConfigCat integration.'
        );

      case "custom":
        throw new Error(
          "Custom provider specified but no provider instance provided. Use createCustomProvider() method."
        );

      default:
        throw new Error(
          `Unknown feature flag provider: ${this.config.provider}`
        );
    }

    await this.provider.initialize();
    return this.provider;
  }

  /**
   * Set a custom provider implementation
   */
  setCustomProvider(provider: FeatureFlagProvider): void {
    this.provider = provider;
    this.config.provider = "custom";
  }

  /**
   * Get the current provider instance
   */
  getProvider(): FeatureFlagProvider | null {
    return this.provider;
  }

  /**
   * Check if a feature flag is enabled
   */
  async isEnabled(
    flagKey: string,
    context?: FeatureFlagContext
  ): Promise<boolean> {
    if (!this.provider) {
      await this.initialize();
    }

    if (!this.provider) {
      throw new Error("Feature flag provider failed to initialize");
    }

    const flagContext = context || this.defaultContext;
    return this.provider.isEnabled(flagKey, flagContext);
  }

  /**
   * Get all feature flags
   */
  async getAllFlags(
    context?: FeatureFlagContext
  ): Promise<Record<string, boolean>> {
    if (!this.provider) {
      await this.initialize();
    }

    if (!this.provider) {
      throw new Error("Feature flag provider failed to initialize");
    }

    const flagContext = context || this.defaultContext;
    return this.provider.getAllFlags(flagContext);
  }

  /**
   * Refresh feature flags from remote source
   */
  async refreshFlags(): Promise<void> {
    if (!this.provider) {
      await this.initialize();
    }

    if (!this.provider) {
      throw new Error("Feature flag provider failed to initialize");
    }

    return this.provider.refreshFlags();
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.provider?.cleanup) {
      this.provider.cleanup();
    }
    this.provider = null;
  }
}

/**
 * Create a feature flag manager from environment variables
 */
export function createFeatureFlagManagerFromEnv(): FeatureFlagManager {
  const provider = (process.env.NEXT_PUBLIC_FEATURE_FLAGS_PROVIDER ||
    "local") as FeatureFlagConfig["provider"];
  const environment = process.env.NODE_ENV || "development";

  const config: FeatureFlagConfig = {
    provider,
    apiKey: process.env.FEATURE_FLAGS_API_KEY,
    environment,
    refreshIntervalMs: parseInt(
      process.env.FEATURE_FLAGS_REFRESH_INTERVAL_MS || "900000"
    ),
    enableLogging: process.env.NODE_ENV === "development",
    localFlags: getLocalFlagsFromEnv(),
  };

  const defaultContext: FeatureFlagContext = {
    environment,
  };

  return new FeatureFlagManager(config, defaultContext);
}

/**
 * Parse local feature flags from environment variables
 */
function getLocalFlagsFromEnv(): Record<string, FeatureFlag> {
  const flags: Record<string, FeatureFlag> = {};

  // Look for environment variables starting with NEXT_PUBLIC_FF_
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith("NEXT_PUBLIC_FF_")) {
      const flagKey = key
        .replace("NEXT_PUBLIC_FF_", "")
        .toLowerCase()
        .replace(/_/g, "-");
      const flagValue = process.env[key];

      try {
        // Try to parse as JSON for complex flag configurations
        const parsedValue = JSON.parse(flagValue || "false");
        if (
          typeof parsedValue === "object" &&
          parsedValue !== null &&
          "key" in parsedValue
        ) {
          // Complex flag configuration
          flags[flagKey] = parsedValue as FeatureFlag;
        } else {
          // Simple boolean flag
          flags[flagKey] = {
            key: flagKey,
            name: flagKey
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()),
            description: `Feature flag for ${flagKey}`,
            enabled: Boolean(parsedValue),
          };
        }
      } catch {
        // Fall back to simple boolean parsing
        flags[flagKey] = {
          key: flagKey,
          name: flagKey
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          description: `Feature flag for ${flagKey}`,
          enabled: flagValue === "true",
        };
      }
    }
  });

  return flags;
}
