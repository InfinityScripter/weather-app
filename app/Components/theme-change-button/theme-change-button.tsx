"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

function ThemeChangeButton() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
      <Button variant="outline" size="icon" onClick={toggleTheme}>
        {resolvedTheme === "dark" ? (
            <Sun className="text-yellow-500 h-[1.2rem] w-[1.2rem]" />
        ) : (
            <Moon className="text-blue-900 h-[1.2rem] w-[1.2rem]" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
  );
}

export default ThemeChangeButton;
