"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";

import { cn } from "@/lib/utils";

export default function MarketingThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const activeTheme = mounted ? resolvedTheme : "light";

  return (
    <div
      className="flex h-10 items-center rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-white/5"
      aria-label="Choose color theme"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={cn(
          "grid size-8 place-items-center rounded-md text-slate-500 transition-colors hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-400 dark:hover:text-white",
          activeTheme === "light" &&
            "bg-white text-slate-950 shadow-sm dark:bg-white/10 dark:text-white"
        )}
        aria-label="Use light theme"
        aria-pressed={activeTheme === "light"}
      >
        <FiSun className="size-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cn(
          "grid size-8 place-items-center rounded-md text-slate-500 transition-colors hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-400 dark:hover:text-white",
          activeTheme === "dark" &&
            "bg-white text-slate-950 shadow-sm dark:bg-white/10 dark:text-white"
        )}
        aria-label="Use dark theme"
        aria-pressed={activeTheme === "dark"}
      >
        <FiMoon className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
