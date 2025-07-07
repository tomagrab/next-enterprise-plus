import { FeatureFlagProvider, FeatureFlagContext, FeatureFlag } from "../types";

/**
 * Local/Static Feature Flag Provider
 * Useful for development, testing, or simple feature flags
 */
export class LocalFeatureFlagProvider implements FeatureFlagProvider {
  private flags: Record<string, FeatureFlag>;
  private enableLogging: boolean;

  constructor(flags: Record<string, FeatureFlag> = {}, enableLogging = false) {
    this.flags = flags;
    this.enableLogging = enableLogging;
  }

  async initialize(): Promise<void> {
    if (this.enableLogging) {
      console.log(
        "LocalFeatureFlagProvider initialized with flags:",
        Object.keys(this.flags)
      );
    }
  }

  async isEnabled(
    flagKey: string,
    context?: FeatureFlagContext
  ): Promise<boolean> {
    const flag = this.flags[flagKey];

    if (!flag) {
      if (this.enableLogging) {
        console.warn(`Feature flag '${flagKey}' not found`);
      }
      return false;
    }

    // Check environment restrictions
    if (flag.environments && context?.environment) {
      if (!flag.environments.includes(context.environment)) {
        return false;
      }
    }

    // Check user group restrictions
    if (flag.userGroups && context?.userRole) {
      if (!flag.userGroups.includes(context.userRole)) {
        return false;
      }
    }

    // Check rollout percentage
    if (flag.rolloutPercentage !== undefined && context?.userId) {
      const hash = this.hashUserId(context.userId + flagKey);
      const userPercentile = hash % 100;
      if (userPercentile >= flag.rolloutPercentage) {
        return false;
      }
    }

    return flag.enabled;
  }

  async getAllFlags(
    context?: FeatureFlagContext
  ): Promise<Record<string, boolean>> {
    const result: Record<string, boolean> = {};

    for (const key of Object.keys(this.flags)) {
      result[key] = await this.isEnabled(key, context);
    }

    return result;
  }

  async refreshFlags(): Promise<void> {
    // For local provider, flags are static unless manually updated
    if (this.enableLogging) {
      console.log("LocalFeatureFlagProvider: No remote flags to refresh");
    }
  }

  updateFlag(flagKey: string, flag: FeatureFlag): void {
    this.flags[flagKey] = flag;
    if (this.enableLogging) {
      console.log(`Updated flag '${flagKey}':`, flag);
    }
  }

  removeFlag(flagKey: string): void {
    delete this.flags[flagKey];
    if (this.enableLogging) {
      console.log(`Removed flag '${flagKey}'`);
    }
  }

  private hashUserId(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}
