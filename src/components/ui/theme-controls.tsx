"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ColorThemeToggle } from "@/components/ui/color-theme-toggle";

export function ThemeControls() {
  return (
    <div className="flex items-center gap-2">
      <ColorThemeToggle />
      <ThemeToggle />
    </div>
  );
}
