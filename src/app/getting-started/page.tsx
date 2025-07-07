export default function GettingStartedPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">🚀 Getting Started</h1>
        <p className="text-muted-foreground text-lg">
          Learn how to customize and extend this Next.js template to build your
          own modern dashboard application. Follow these steps to get up and
          running quickly.
        </p>
      </div>

      {/* Quick Start Steps */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Quick Start Guide</h2>

        <div className="space-y-4">
          <div className="p-6 border rounded-lg space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <h3 className="text-xl font-semibold">Customize the Sidebar</h3>
            </div>
            <p className="text-muted-foreground">
              Edit{" "}
              <code className="bg-muted px-2 py-1 rounded text-sm">
                src/components/ui/app-sidebar.tsx
              </code>{" "}
              to add your navigation items.
            </p>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Navigation Structure</h4>
              <code className="text-xs whitespace-pre-wrap">
                {`const navigationItems = [
  {
    title: "Your Page",
    url: "/your-page",
    icon: YourIcon,
  },
  // Add more items...
];`}
              </code>
            </div>
          </div>

          <div className="p-6 border rounded-lg space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <h3 className="text-xl font-semibold">Add Your Pages</h3>
            </div>
            <p className="text-muted-foreground">
              Create new pages in{" "}
              <code className="bg-muted px-2 py-1 rounded text-sm">
                src/app/
              </code>{" "}
              and update the navigation arrays.
            </p>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Page Structure</h4>
              <code className="text-xs whitespace-pre-wrap">
                {`// src/app/your-page/page.tsx
export default function YourPage() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Your Page</h1>
      {/* Your content */}
    </div>
  );
}`}
              </code>
            </div>
          </div>

          <div className="p-6 border rounded-lg space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <h3 className="text-xl font-semibold">Setup Authentication</h3>
            </div>
            <p className="text-muted-foreground">
              Configure your authentication providers and update environment
              variables.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Environment Setup</h4>
                <code className="text-xs">
                  cp .env.example .env.local
                  <br />
                  npx auth secret
                </code>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Provider Configuration</h4>
                <p className="text-xs text-muted-foreground">
                  Edit <code>auth.ts</code> to enable your OAuth providers
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                4
              </span>
              <h3 className="text-xl font-semibold">Update Branding</h3>
            </div>
            <p className="text-muted-foreground">
              Modify the app name, logo, and metadata in the layout and sidebar
              components.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">App Metadata</h4>
                <p className="text-xs text-muted-foreground">
                  Update <code>src/app/layout.tsx</code> for SEO and metadata
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Sidebar Branding</h4>
                <p className="text-xs text-muted-foreground">
                  Customize logo and app name in sidebar header
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customization Options */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">🎨 Customization Options</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Theming</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Light/dark mode support</li>
              <li>• Custom color schemes</li>
              <li>• CSS variable customization</li>
              <li>• Tailwind config modification</li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Layout</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Sidebar configuration</li>
              <li>• Mobile navigation</li>
              <li>• Responsive breakpoints</li>
              <li>• Content overflow handling</li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Components</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• shadcn/ui components</li>
              <li>• Custom component creation</li>
              <li>• Icon customization</li>
              <li>• Form components</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Development Workflow */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">⚡ Development Workflow</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-medium">Development Commands</h3>
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-lg">
                <code className="text-sm">npm run dev</code>
                <p className="text-xs text-muted-foreground mt-1">
                  Start development server
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <code className="text-sm">npm run build</code>
                <p className="text-xs text-muted-foreground mt-1">
                  Build for production
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <code className="text-sm">npm run test</code>
                <p className="text-xs text-muted-foreground mt-1">
                  Run test suite
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">Quality Tools</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• TypeScript for type safety</li>
              <li>• ESLint for code quality</li>
              <li>• Prettier for formatting</li>
              <li>• Jest for testing</li>
              <li>• Husky for git hooks</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="p-6 border rounded-lg space-y-4 bg-blue-50 dark:bg-blue-950/20">
        <h2 className="text-xl font-semibold">💡 Best Practices</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-medium">Code Organization</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Keep components small and focused</li>
              <li>• Use TypeScript for type safety</li>
              <li>• Follow Next.js app router conventions</li>
              <li>• Implement proper error boundaries</li>
              <li>• Use server components when possible</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">Performance</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Optimize images with Next.js Image</li>
              <li>• Use dynamic imports for code splitting</li>
              <li>• Implement proper caching strategies</li>
              <li>• Monitor Core Web Vitals</li>
              <li>• Lazy load non-critical components</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">🎯 Next Steps</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
              API Integration
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Connect to external APIs for data fetching and manipulation.{" "}
              <a
                href="https://github.com/tomagrab/next-enterprise-plus#api-integration"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline font-medium"
              >
                View architecture guide →
              </a>
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              State Management
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Implement Zustand, Redux, or other state management solutions.
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
              Deployment
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Deploy to Vercel, Netlify, or your preferred hosting platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
