"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <SunMedium className="h-4 w-4 scale-100 transition-all dark:scale-0" />
      <MoonStar className="absolute h-4 w-4 scale-0 transition-all dark:scale-100" />
    </Button>
  );
}