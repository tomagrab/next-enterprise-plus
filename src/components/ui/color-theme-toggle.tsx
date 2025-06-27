"use client";

import * as React from "react";
import { Palette } from "lucide-react";
import {
  useColorTheme,
  type ColorTheme,
} from "@/components/providers/theme/color-theme-provider";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const colorThemes: { value: ColorTheme; label: string; color: string }[] = [
  { value: "blue", label: "Blue", color: "oklch(0.623 0.214 259.815)" },
  { value: "red", label: "Red", color: "oklch(0.637 0.237 25.331)" },
  { value: "rose", label: "Rose", color: "oklch(0.645 0.246 16.439)" },
  { value: "orange", label: "Orange", color: "oklch(0.705 0.213 47.604)" },
  { value: "green", label: "Green", color: "oklch(0.723 0.219 149.579)" },
  { value: "violet", label: "Violet", color: "oklch(0.606 0.25 292.717)" },
];

export function ColorThemeToggle() {
  const { colorTheme, setColorTheme } = useColorTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle color theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {colorThemes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => setColorTheme(theme.value)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div
              className="w-4 h-4 rounded-full border-2 border-border"
              style={{ backgroundColor: theme.color }}
            />
            <span className={colorTheme === theme.value ? "font-semibold" : ""}>
              {theme.label}
            </span>
            {colorTheme === theme.value && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
