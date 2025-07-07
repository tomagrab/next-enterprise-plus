import {
  NewFeatureDemo,
  FeatureFlagDebugPanel,
} from "@/components/demo/feature-flag-demo";

export default function FeatureFlagsPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">🚩 Feature Flags Demo</h1>
        <p className="text-muted-foreground text-lg">
          Explore the feature flag system with interactive examples and
          real-time controls. Test different flag configurations and see how
          they affect components and user experience.
        </p>
      </div>

      {/* Live Demo */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 border rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">🔴 Live Demo</h2>
          <NewFeatureDemo />
        </div>

        <div className="p-6 border rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">🐛 Debug Panel</h2>
          <FeatureFlagDebugPanel />
        </div>
      </div>

      {/* Configuration Guide */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">📋 Configuration Guide</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-medium">Environment Variables</h3>
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-lg">
                <code className="text-sm">NEXT_PUBLIC_FF_PROVIDER=local</code>
                <p className="text-xs text-muted-foreground mt-1">
                  Set the feature flag provider
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <code className="text-sm">NEXT_PUBLIC_FF_NEW_FEATURE=true</code>
                <p className="text-xs text-muted-foreground mt-1">
                  Enable a simple boolean flag
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <code className="text-sm">
                  NEXT_PUBLIC_FF_BETA_FEATURES=false
                </code>
                <p className="text-xs text-muted-foreground mt-1">
                  Disable beta features
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Advanced Configuration</h3>
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-lg">
                <code className="text-sm break-all">
                  NEXT_PUBLIC_FF_PREMIUM_FEATURES=
                  {`{"enabled":true,"rolloutPercentage":50}`}
                </code>
                <p className="text-xs text-muted-foreground mt-1">
                  Gradual rollout to 50% of users
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <code className="text-sm break-all">
                  NEXT_PUBLIC_FF_EXPERIMENTAL_UI=
                  {`{"enabled":true,"userGroups":["beta","admin"]}`}
                </code>
                <p className="text-xs text-muted-foreground mt-1">
                  Target specific user groups
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">💻 Code Examples</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-medium">Basic Usage</h3>
            <div className="p-4 bg-muted rounded-lg">
              <pre className="text-sm overflow-x-auto">
                <code>{`import { useFeatureFlag } from "@/lib/feature-flags";

function MyComponent() {
  const isEnabled = useFeatureFlag("newFeature");
  
  return (
    <div>
      {isEnabled ? (
        <NewComponent />
      ) : (
        <LegacyComponent />
      )}
    </div>
  );
}`}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Multiple Flags</h3>
            <div className="p-4 bg-muted rounded-lg">
              <pre className="text-sm overflow-x-auto">
                <code>{`import { useFeatureFlags } from "@/lib/feature-flags";

function Dashboard() {
  const flags = useFeatureFlags([
    "analytics",
    "betaFeatures",
    "experimentalUI"
  ]);
  
  return (
    <div>
      {flags.analytics && <AnalyticsPanel />}
      {flags.betaFeatures && <BetaSection />}
    </div>
  );
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Notes */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">🔧 Integration & Extension</h2>

        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Third-Party Providers
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              The system is designed for easy integration with LaunchDarkly,
              ConfigCat, Flagsmith, or custom providers. Extend the base
              provider interface to add your preferred service.
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
              Testing & Development
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Use the debug panel in development to test flag configurations.
              Mock flags in tests for reliable component testing across
              different feature states.
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
              Production Deployment
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Configure flags via environment variables in your deployment
              platform. Use gradual rollouts and user targeting for safe feature
              releases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
