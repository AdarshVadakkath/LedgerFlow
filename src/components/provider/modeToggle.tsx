"use client";

import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/provider/theme-provider";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {/* Icon switch */}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <Palette className="absolute h-[1.2rem] w-[1.2rem] opacity-0 group-hover:opacity-100 transition-all" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Default Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Default Dark
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("blue-light")}>
          Blue Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("blue-dark")}>
          Blue Dark
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("green-light")}>
          Green Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("green-dark")}>
          Green Dark
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("purple-light")}>
          Purple Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("purple-dark")}>
          Purple Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
