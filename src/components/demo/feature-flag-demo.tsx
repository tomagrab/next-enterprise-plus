"use client";

import { useFeatureFlag, useFeatureFlags } from "@/lib/feature-flags";

/**
 * Example component that demonstrates conditional rendering based on feature flags
 */
export function NewFeatureDemo() {
  const isNewFeatureEnabled = useFeatureFlag("new-dashboard");
  const isBetaFeaturesEnabled = useFeatureFlag("beta-features");

  if (!isNewFeatureEnabled) {
    return null;
  }

  return (
    <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
        🎉 New Dashboard Available!
      </h3>
      <p className="text-blue-700 dark:text-blue-200 mb-4">
        Try out our redesigned dashboard with improved performance and new
        features.
      </p>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          aria-label="Try the new dashboard with improved performance and features"
          type="button"
        >
          Try New Dashboard
        </button>
        {isBetaFeaturesEnabled && (
          <button
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
            aria-label="Enable beta features for early access to experimental functionality"
            type="button"
          >
            Enable Beta Features
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Example component that shows feature flag debugging information
 */
export function FeatureFlagDebugPanel() {
  const { getAllFlags, isLoading, error } = useFeatureFlags();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Loading feature flags...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900 rounded-lg">
        <p className="text-sm text-red-600 dark:text-red-400">
          Error loading feature flags: {error}
        </p>
      </div>
    );
  }

  const flags = getAllFlags();

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Feature Flags (Development)
      </h4>
      <div className="space-y-1">
        {Object.entries(flags).map(([key, enabled]) => (
          <div key={key} className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">{key}</span>
            <span
              className={`px-2 py-1 rounded text-white ${
                enabled ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {enabled ? "ON" : "OFF"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
