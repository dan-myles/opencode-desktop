import { useState } from "react"
import { Monitor, Moon, Palette, Sun } from "lucide-react"

import { Badge } from "@/app/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Label } from "@/app/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/app/components/ui/select"
import { useThemeStore } from "@/app/stores/theme.store"

export function AppearanceSection() {
  const { theme, setTheme } = useThemeStore()
  const [colorScheme, setColorScheme] = useState("tangerine")

  const getThemeIcon = (themeValue: string) => {
    switch (themeValue) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      case "system":
        return <Monitor className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const getThemeLabel = (themeValue: string) => {
    switch (themeValue) {
      case "light":
        return "Light"
      case "dark":
        return "Dark"
      case "system":
        return "System"
      default:
        return "System"
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <Palette className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Appearance</h2>
      </div>

      <Card className="bg-background/50">
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>
            Choose how the application looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="theme-select">Color theme</Label>
              <p className="text-muted-foreground text-sm">
                Select your preferred color theme
              </p>
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-[180px]" id="theme-select">
                <div className="flex items-center gap-2">
                  {getThemeIcon(theme)}
                  {getThemeLabel(theme)}
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    System
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="color-scheme-select">Color palette</Label>
              <p className="text-muted-foreground text-sm">
                Select from available color schemes
              </p>
            </div>
            <Select value={colorScheme} onValueChange={setColorScheme}>
              <SelectTrigger className="w-[180px]" id="color-scheme-select">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full bg-gradient-to-r
                      from-orange-400 to-orange-600"
                  ></div>
                  Tangerine
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tangerine" disabled>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full bg-gradient-to-r
                        from-orange-400 to-orange-600"
                    ></div>
                    <span>Tangerine</span>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Current
                    </Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
