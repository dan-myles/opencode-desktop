import { useEffect } from "react"

import { useThemeStore } from "@/app/stores/theme.store"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, resolvedTheme, setTheme, setSystemTheme } = useThemeStore()

  // System theme detection
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light")
    }

    // Set initial system theme
    setSystemTheme(mediaQuery.matches ? "dark" : "light")

    // Listen for system theme changes
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [setSystemTheme])

  // Initialize theme on mount
  useEffect(() => {
    // Trigger theme application on initial load
    setTheme(theme)
  }, [setTheme, theme])

  // Apply theme changes to document
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(resolvedTheme)
  }, [resolvedTheme])

  return <>{children}</>
}
