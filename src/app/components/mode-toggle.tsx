import { Moon, Sun } from "lucide-react"

import { useTheme } from "@/app/components/providers/theme.provider"
import { Button } from "@/app/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { useRegisterKeybind } from "../hooks/use-register-keybind"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  useRegisterKeybind({
    id: "toggle-light-dark-mode",
    key: "cmd+t",
    description: "Toggle light/dark mode",
    callback: () => {
      if (theme === "dark") setTheme("light")
      if (theme === "light") setTheme("dark")
    },
    platform: "darwin",
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun
            className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all
              dark:scale-0 dark:-rotate-90"
          />
          <Moon
            className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90
              transition-all dark:scale-100 dark:rotate-0"
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
