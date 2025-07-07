import { ErrorTestingDemo } from "@/components/demo/error-testing-demo";

export default function ErrorTestingPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">🧪 Error Handling Testing</h1>
        <p className="text-muted-foreground text-lg">
          Test the comprehensive error handling system in development mode. This
          page demonstrates different error scenarios and how they&apos;re
          handled gracefully throughout the application.
        </p>
      </div>

      {/* Error Handling Overview */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">🛡️ Error Handling System</h2>
        <p className="text-muted-foreground">
          Our comprehensive error handling system provides production-ready
          error management with proper logging, user feedback, and recovery
          options.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-medium">Error Boundaries</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• React error boundary implementation</li>
              <li>• Custom fallback components</li>
              <li>• Development vs production modes</li>
              <li>• Error recovery mechanisms</li>
              <li>• Stack trace display in dev mode</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">API Error Handling</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Structured error responses</li>
              <li>• HTTP status code mapping</li>
              <li>• Validation error formatting</li>
              <li>• Rate limiting error handling</li>
              <li>• Network error recovery</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">Client-Side Utilities</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Error logging utilities</li>
              <li>• Toast notifications for errors</li>
              <li>• Form validation error display</li>
              <li>• Retry mechanisms</li>
              <li>• User-friendly error messages</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">Monitoring Integration</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Sentry integration ready</li>
              <li>• Custom error tracking</li>
              <li>• Performance monitoring</li>
              <li>• Error context collection</li>
              <li>• User session tracking</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Error Types */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">⚠️ Error Scenarios</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">
              Component Errors
            </h3>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
              <li>• Render errors</li>
              <li>• State update errors</li>
              <li>• Effect errors</li>
              <li>• Event handler errors</li>
            </ul>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
              API Errors
            </h3>
            <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
              <li>• Network failures</li>
              <li>• Server errors (5xx)</li>
              <li>• Client errors (4xx)</li>
              <li>• Timeout errors</li>
            </ul>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Validation Errors
            </h3>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Form validation</li>
              <li>• Schema validation</li>
              <li>• Type errors</li>
              <li>• Business logic errors</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          🚀 Try Different Error Scenarios
        </h2>
        <p className="text-muted-foreground">
          Use the controls below to trigger different types of errors and see
          how they&apos;re handled by the error boundary system.
        </p>
        <div className="flex justify-center">
          <ErrorTestingDemo />
        </div>
      </div>

      {/* Implementation Guide */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">🔧 Implementation Details</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Error Boundary Setup</h3>
            <div className="p-3 bg-muted rounded-lg">
              <code className="text-xs">
                {`// Wrap your app or components with ErrorBoundary
<ErrorBoundary fallback={CustomErrorFallback}>
  <YourComponent />
</ErrorBoundary>`}
              </code>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">API Error Handling</h3>
            <div className="p-3 bg-muted rounded-lg">
              <code className="text-xs">
                {`// Structured API error responses
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": ["Email is required"]
  }
}`}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="p-6 border rounded-lg space-y-4 bg-blue-50 dark:bg-blue-950/20">
        <h2 className="text-xl font-semibold">💡 Best Practices</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium">✅ Do</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Provide clear, actionable error messages</li>
              <li>• Log errors with sufficient context</li>
              <li>• Offer recovery options when possible</li>
              <li>• Test error scenarios regularly</li>
              <li>• Monitor error rates in production</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">❌ Don&apos;t</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Expose sensitive information in errors</li>
              <li>• Let errors crash the entire application</li>
              <li>• Ignore or suppress errors silently</li>
              <li>• Show technical stack traces to users</li>
              <li>• Forget to handle async errors</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
