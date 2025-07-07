/**
 * Feature flag configuration types
 */

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  environments?: string[];
  userGroups?: string[];
  rolloutPercentage?: number;
}

export interface FeatureFlagContext {
  userId?: string;
  userEmail?: string;
  userRole?: string;
  environment: string;
  sessionId?: string;
  customAttributes?: Record<string, unknown>;
}

export interface FeatureFlagProvider {
  initialize(): Promise<void>;
  isEnabled(flagKey: string, context?: FeatureFlagContext): Promise<boolean>;
  getAllFlags(context?: FeatureFlagContext): Promise<Record<string, boolean>>;
  refreshFlags(): Promise<void>;
  cleanup?(): void;
}

export type FeatureFlagConfig = {
  provider: "local" | "launchdarkly" | "splitio" | "configcat" | "custom";
  apiKey?: string;
  environment?: string;
  refreshIntervalMs?: number;
  enableLogging?: boolean;
  localFlags?: Record<string, FeatureFlag>;
};
