import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <Image
          className="dark:invert mx-auto"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-3xl font-bold">Next Enterprise Plus</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A modern, responsive template built with Next.js, TypeScript, Tailwind
          CSS, and shadcn/ui components. Perfect for building dashboard
          applications with professional UI/UX patterns.
        </p>
      </div>

      {/* Features Overview */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-center">Template Features</h2>

        {/* Responsive Layout Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="p-6 border rounded-lg space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              🖥️ Desktop Experience
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • <strong>Collapsible Sidebar:</strong> Navigate with icons or
                full labels
              </li>
              <li>
                • <strong>Integrated Authentication:</strong> Sign in/out and
                user menu directly in the sidebar
              </li>
              <li>
                • <strong>Tooltip Support:</strong> Hover over collapsed icons
                for labels
              </li>
              <li>
                • <strong>Breadcrumb Navigation:</strong> Always know where you
                are
              </li>
              <li>
                • <strong>Sidebar Persistence:</strong> Remembers your
                preference
              </li>
              <li>
                • <strong>Keyboard Shortcuts:</strong> Press{" "}
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">
                  CTRL + B
                </kbd>{" "}
                to toggle sidebar
              </li>
            </ul>
          </div>

          <div className="p-6 border rounded-lg space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              📱 Mobile Experience
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • <strong>Bottom Tab Navigation:</strong> Easy thumb navigation
              </li>
              <li>
                • <strong>Prominent Home Button:</strong> Central, elevated
                design
              </li>
              <li>
                • <strong>Active State Indicators:</strong> Clear visual
                feedback
              </li>
              <li>
                • <strong>Touch-Optimized:</strong> Proper sizing for mobile
                interaction
              </li>
              <li>
                • <strong>Responsive Breakpoints:</strong> Seamless transition
                at md (768px)
              </li>
            </ul>
          </div>
        </div>

        {/* Technical Features */}
        <div className="p-6 border rounded-lg space-y-4">
          <h3 className="text-xl font-semibold">🛠️ Technical Implementation</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <h4 className="font-medium">Framework & Tools</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Next.js 15 with App Router</li>
                <li>• TypeScript for type safety</li>
                <li>• Tailwind CSS for styling</li>
                <li>• shadcn/ui component library</li>
                <li>• NextAuth.js for authentication</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Layout Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Standardized overflow handling</li>
                <li>• Flex-based responsive layout</li>
                <li>• Theme support (light/dark)</li>
                <li>• Unified provider system</li>
                <li>• Proper semantic HTML</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Authentication</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• NextAuth.js v4 integration</li>
                <li>• Sidebar-based user interface</li>
                <li>• Multiple provider support</li>
                <li>• Session management & persistence</li>
                <li>• Secure server actions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Security & Compliance</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Input validation with Zod</li>
                <li>• Rate limiting middleware</li>
                <li>• CSRF protection</li>
                <li>• Content Security Policy</li>
                <li>• Security headers configuration</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Clean Architecture */}
        <div className="p-6 border rounded-lg space-y-4">
          <h3 className="text-xl font-semibold">🏗️ Clean Architecture</h3>
          <p className="text-muted-foreground">
            The template follows modern React patterns with proper separation of
            concerns, clean component architecture, and production-ready code
            organization.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">Server/Client Separation</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Server components for data fetching</li>
                <li>• Client components for interactivity</li>
                <li>• Proper server actions implementation</li>
                <li>• Context providers organized cleanly</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Code Organization</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Logical folder structure</li>
                <li>• Component library organization</li>
                <li>• Type definitions and schemas</li>
                <li>• Utility functions and hooks</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Latest Enhancements */}
        <div className="p-6 border rounded-lg space-y-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <h3 className="text-xl font-semibold">✨ Latest Enhancements</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-3">
              <h4 className="font-medium">🔄 Authentication Migration</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• NextAuth.js v4 stable integration</li>
                <li>• Microsoft Entra ID support</li>
                <li>• Sidebar-based auth UI</li>
                <li>• Session persistence improvements</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">⚡ Provider System</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Unified provider architecture</li>
                <li>• Theme provider integration</li>
                <li>• Session provider optimization</li>
                <li>• Error boundary providers</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">🛡️ Security & Compliance</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Comprehensive security layer</li>
                <li>• OWASP Top 10 protection</li>
                <li>• GDPR compliance ready</li>
                <li>• SOC 2 aligned controls</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Error Handling & Monitoring */}
        <div className="p-6 border rounded-lg space-y-4">
          <h3 className="text-xl font-semibold">
            🛡️ Error Handling & Monitoring
          </h3>
          <p className="text-muted-foreground">
            Comprehensive error handling system for production-ready
            applications. Includes error boundaries, API error handling,
            client-side error utilities, and integration guides for popular
            monitoring services.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">Error Boundaries</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• React error boundary implementation</li>
                <li>• Custom fallback components</li>
                <li>• Development vs production modes</li>
                <li>• Error recovery mechanisms</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">API Error Handling</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Structured error responses</li>
                <li>• HTTP status code mapping</li>
                <li>• Validation error formatting</li>
                <li>• Network error recovery</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Client-Side Utilities</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Error logging utilities</li>
                <li>• Toast notifications for errors</li>
                <li>• Form validation error display</li>
                <li>• Retry mechanisms</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Monitoring Integration</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Sentry integration ready</li>
                <li>• Custom error tracking</li>
                <li>• Performance monitoring</li>
                <li>• User session tracking</li>
              </ul>
            </div>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Files:</strong> See{" "}
              <code className="mx-1 px-1 bg-blue-100 dark:bg-blue-900 rounded">
                ERROR_MONITORING.md
              </code>{" "}
              for complete setup instructions and monitoring service
              integration.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="p-6 border rounded-lg space-y-4">
          <h3 className="text-xl font-semibold">🚀 Explore the Template</h3>
          <p className="text-muted-foreground">
            Ready to get started? Explore the interactive demos and setup guides
            to make the most of this template.
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/getting-started"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h4 className="font-medium mb-2">🚀 Getting Started</h4>
              <p className="text-sm text-muted-foreground">
                Step-by-step guide to customize and deploy your application.
              </p>
            </Link>
            <Link
              href="/auth-setup"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h4 className="font-medium mb-2">🔐 Authentication Setup</h4>
              <p className="text-sm text-muted-foreground">
                Configure OAuth providers and authentication flows.
              </p>
            </Link>
            <Link
              href="/security-testing"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h4 className="font-medium mb-2">🛡️ Security Testing</h4>
              <p className="text-sm text-muted-foreground">
                Test validation, rate limiting, and security features.
              </p>
            </Link>
            <Link
              href="/error-testing"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h4 className="font-medium mb-2">🧪 Error Testing</h4>
              <p className="text-sm text-muted-foreground">
                Explore error handling and recovery mechanisms.
              </p>
            </Link>
            <Link
              href="/server-actions"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h4 className="font-medium mb-2">⚡ Server Actions</h4>
              <p className="text-sm text-muted-foreground">
                Test server-side actions with comprehensive error handling.
              </p>
            </Link>
            <Link
              href="/overflow-demo"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h4 className="font-medium mb-2">📋 Overflow Demo</h4>
              <p className="text-sm text-muted-foreground">
                Interactive demo of the standardized overflow system.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
