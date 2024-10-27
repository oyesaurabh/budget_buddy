"use client";
import { toast } from "sonner";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DarkmodeToggle() {
  const { setTheme } = useTheme();
  const [darkTheme, setDarkTheme] = useState(true);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-[2rem] justify-center font-medium text-white border-none bg-white/10 hover:text-white hover:bg-white/20"
        >
          {darkTheme ? <Moon className="" /> : <Sun className="" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            setTheme("light");
            setDarkTheme(false);
            toast("Light Theme 🌞");
          }}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme("dark");
            setDarkTheme(true);
            toast("Dark Theme 🌚");
          }}
        >
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
