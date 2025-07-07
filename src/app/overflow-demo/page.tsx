import { OverflowDemo } from "@/components/demo/overflow-demo";

export default function OverflowDemoPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">📋 Interactive Overflow Demo</h1>
        <p className="text-muted-foreground text-lg">
          Explore how the standardized overflow system works throughout the
          application. This demo shows how the header and navigation stay fixed
          while only the main content scrolls, providing a consistent user
          experience.
        </p>
      </div>

      {/* Overview */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">🏗️ Overflow System Overview</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-medium">Key Features</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Fixed header and navigation</li>
              <li>• Scrollable main content area</li>
              <li>• Responsive design patterns</li>
              <li>• Consistent across all pages</li>
              <li>• Mobile-optimized scrolling</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">Technical Implementation</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Flexbox-based layout system</li>
              <li>• CSS Grid for complex layouts</li>
              <li>• Tailwind CSS utilities</li>
              <li>• Semantic HTML structure</li>
              <li>• Accessibility considerations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">✨ Benefits</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">🎯 User Experience</h3>
            <p className="text-sm text-muted-foreground">
              Navigation remains accessible at all times, improving user
              workflow and reducing cognitive load.
            </p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">📱 Mobile Friendly</h3>
            <p className="text-sm text-muted-foreground">
              Optimized scrolling behavior for touch devices with proper
              momentum and boundaries.
            </p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">🏗️ Maintainable</h3>
            <p className="text-sm text-muted-foreground">
              Standardized approach across all pages reduces complexity and
              improves consistency.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">🚀 Try It Out</h2>
        <p className="text-muted-foreground">
          Add content below to see how the overflow system works. Notice how the
          header and navigation stay fixed while only the main content scrolls.
        </p>
        <OverflowDemo />
      </div>

      {/* Usage Guide */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">📖 Usage Guide</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Basic Structure</h3>
            <div className="p-3 bg-muted rounded-lg">
              <code className="text-xs">
                {`<div className="flex flex-col h-screen">
  <header>Fixed Header</header>
  <main className="flex-1 overflow-auto">
    Scrollable Content
  </main>
</div>`}
              </code>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Key Classes</h3>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="p-3 bg-muted rounded-lg">
                <code className="text-xs font-mono">flex-1</code>
                <p className="text-xs text-muted-foreground mt-1">
                  Makes element take remaining space
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <code className="text-xs font-mono">overflow-auto</code>
                <p className="text-xs text-muted-foreground mt-1">
                  Enables scrolling when needed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
