// Core types and interfaces
export type {
  FeatureFlag,
  FeatureFlagContext,
  FeatureFlagProvider as IFeatureFlagProvider,
  FeatureFlagConfig,
} from "./types";

// Providers
export { LocalFeatureFlagProvider } from "./providers/local";

// Manager
export { FeatureFlagManager, createFeatureFlagManagerFromEnv } from "./manager";

// React integration
export {
  FeatureFlagProvider,
  useFeatureFlags,
  useFeatureFlag,
} from "./context";
