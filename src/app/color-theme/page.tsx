import { ColorThemeDemo } from "@/components/demo/color-theme-demo";

export default function ColorThemePage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">🎨 Color Theme System</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore the dynamic color theme system that allows users to switch
          between different color schemes while maintaining full light/dark mode
          compatibility. All themes are built with accessibility and consistency
          in mind.
        </p>
      </div>

      {/* Overview Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">How It Works</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 border rounded-lg space-y-4">
            <h3 className="text-xl font-semibold">
              🔧 Technical Implementation
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • <strong>CSS Custom Properties:</strong> Dynamic color
                variables that update in real-time
              </li>
              <li>
                • <strong>Theme Classes:</strong> Each color theme applies
                specific CSS classes to the document
              </li>
              <li>
                • <strong>Context Provider:</strong> React context manages theme
                state across the application
              </li>
              <li>
                • <strong>LocalStorage Persistence:</strong> User preferences
                are saved and restored
              </li>
              <li>
                • <strong>Light/Dark Compatible:</strong> Each color theme has
                optimized light and dark variants
              </li>
            </ul>
          </div>

          <div className="p-6 border rounded-lg space-y-4">
            <h3 className="text-xl font-semibold">🎯 Design Principles</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • <strong>Consistent Contrast:</strong> All themes maintain WCAG
                accessibility standards
              </li>
              <li>
                • <strong>Semantic Colors:</strong> Primary, secondary, and
                accent colors follow design tokens
              </li>
              <li>
                • <strong>Component Harmony:</strong> Every UI component adapts
                automatically
              </li>
              <li>
                • <strong>Brand Flexibility:</strong> Easy to customize for
                different brand colors
              </li>
              <li>
                • <strong>System Integration:</strong> Works seamlessly with
                system light/dark preferences
              </li>
            </ul>
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
          <h3 className="text-lg font-semibold mb-3">💡 Usage Tips</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">For Users:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Click the palette icon in the header to change themes</li>
                <li>• Your preference is automatically saved</li>
                <li>
                  • Try switching between light and dark modes with different
                  colors
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">For Developers:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • Use{" "}
                  <code className="px-1 bg-muted rounded">useColorTheme()</code>{" "}
                  hook to access current theme
                </li>
                <li>• CSS variables automatically update when theme changes</li>
                <li>• Add new themes by extending the CSS and theme types</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Interactive Demo</h2>
        <ColorThemeDemo />
      </div>
    </div>
  );
}
