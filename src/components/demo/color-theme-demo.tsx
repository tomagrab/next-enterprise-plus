"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useColorTheme } from "@/components/providers/theme/color-theme-provider";
import { useTheme } from "next-themes";
import { Palette, RefreshCw, Info } from "lucide-react";

const colorThemes = [
  {
    value: "blue" as const,
    label: "Blue",
    emoji: "🔵",
    description: "Professional and trustworthy",
  },
  {
    value: "red" as const,
    label: "Red",
    emoji: "🔴",
    description: "Bold and energetic",
  },
  {
    value: "rose" as const,
    label: "Rose",
    emoji: "🌹",
    description: "Warm and elegant",
  },
  {
    value: "orange" as const,
    label: "Orange",
    emoji: "🟠",
    description: "Creative and vibrant",
  },
  {
    value: "green" as const,
    label: "Green",
    emoji: "🟢",
    description: "Natural and calming",
  },
  {
    value: "violet" as const,
    label: "Violet",
    emoji: "🟣",
    description: "Modern and sophisticated",
  },
];

export function ColorThemeDemo() {
  const { colorTheme, setColorTheme } = useColorTheme();
  const { theme, setTheme } = useTheme();
  const [sliderValue, setSliderValue] = useState([50]);
  const [switchValue, setSwitchValue] = useState(false);
  const [inputValue, setInputValue] = useState("Sample input text");

  const currentTheme = colorThemes.find((t) => t.value === colorTheme);

  return (
    <div className="space-y-8">
      {/* Theme Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Choose Your Color Theme</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {colorThemes.map((theme) => (
            <Button
              key={theme.value}
              variant={colorTheme === theme.value ? "default" : "outline"}
              onClick={() => setColorTheme(theme.value)}
              className="flex flex-col gap-2 h-auto py-4 relative"
            >
              <span className="text-2xl">{theme.emoji}</span>
              <span className="text-sm font-medium">{theme.label}</span>
              <span className="text-xs text-muted-foreground text-center">
                {theme.description}
              </span>
              {colorTheme === theme.value && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background"></div>
              )}
            </Button>
          ))}
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Currently using:</strong> {currentTheme?.label} theme{" "}
            {currentTheme?.emoji}. Try switching between light and dark modes to
            see how each color theme adapts!
          </AlertDescription>
        </Alert>
      </div>

      {/* Light/Dark Mode Integration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Light/Dark Mode Integration</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            onClick={() => setTheme("light")}
            size="sm"
          >
            ☀️ Light Mode
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            onClick={() => setTheme("dark")}
            size="sm"
          >
            🌙 Dark Mode
          </Button>
          <Button
            variant={theme === "system" ? "default" : "outline"}
            onClick={() => setTheme("system")}
            size="sm"
          >
            💻 System
          </Button>
        </div>
      </div>

      {/* Component Showcase */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Component Showcase</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Buttons and Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Buttons & Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">Primary Button</Button>
              <Button variant="secondary" className="w-full">
                Secondary Button
              </Button>
              <Button variant="outline" className="w-full">
                Outline Button
              </Button>
              <Button variant="destructive" className="w-full">
                Destructive Button
              </Button>
              <div className="flex gap-2">
                <Badge>Primary Badge</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Form Elements */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Form Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="demo-input">Input Field</Label>
                <Input
                  id="demo-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type something..."
                />
              </div>

              <div className="space-y-2">
                <Label>Progress: {sliderValue[0]}%</Label>
                <Progress value={sliderValue[0]} className="w-full" />
              </div>

              <div className="space-y-2">
                <Label>Slider Control</Label>
                <Slider
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="demo-switch"
                  checked={switchValue}
                  onCheckedChange={setSwitchValue}
                />
                <Label htmlFor="demo-switch">Toggle switch</Label>
              </div>
            </CardContent>
          </Card>

          {/* Color Indicators */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Color System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-primary border"></div>
                  <span className="text-sm">Primary Color</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-secondary border"></div>
                  <span className="text-sm">Secondary Color</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-accent border"></div>
                  <span className="text-sm">Accent Color</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-muted border"></div>
                  <span className="text-sm">Muted Color</span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-background"></div>
                  <span className="text-sm">Focus Ring</span>
                </div>
              </div>

              <div className="text-center mt-4">
                <div className="text-2xl mb-1">{currentTheme?.emoji}</div>
                <div className="text-sm font-medium">{currentTheme?.label}</div>
                <div className="text-xs text-muted-foreground">
                  Active Theme
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert Examples */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Alert Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This is a default alert that adapts to your chosen color
                  theme.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This is a destructive alert with consistent styling across all
                  themes.
                </AlertDescription>
              </Alert>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-sm">
                    <strong>Primary background:</strong> Uses the current
                    theme&apos;s primary color with transparency.
                  </p>
                </div>
                <div className="p-3 bg-secondary border rounded-lg">
                  <p className="text-sm">
                    <strong>Secondary background:</strong> Maintains readability
                    across all themes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Technical Information */}
      <div className="p-4 bg-muted/50 rounded-lg border">
        <h4 className="font-medium mb-2">Technical Details</h4>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-muted-foreground">
          <div>
            <strong>Current Color Theme:</strong>{" "}
            <code className="px-1 bg-background rounded">{colorTheme}</code>
          </div>
          <div>
            <strong>Current Mode:</strong>{" "}
            <code className="px-1 bg-background rounded">{theme}</code>
          </div>
          <div>
            <strong>CSS Class:</strong>{" "}
            <code className="px-1 bg-background rounded">
              theme-{colorTheme}
            </code>
          </div>
          <div>
            <strong>Persistence:</strong>{" "}
            <code className="px-1 bg-background rounded">localStorage</code>
          </div>
        </div>
      </div>
    </div>
  );
}
