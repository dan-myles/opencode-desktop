import { create } from "zustand"
import { persist } from "zustand/middleware"

type Theme = "light" | "dark" | "system"

interface ThemeStore {
  theme: Theme
  resolvedTheme: "light" | "dark"
  systemTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setSystemTheme: (theme: "light" | "dark") => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "system",
      resolvedTheme: "light",
      systemTheme: "light",

      setTheme: (theme) => {
        const { systemTheme } = get()
        const resolvedTheme = theme === "system" ? systemTheme : theme
        set({ theme, resolvedTheme })
      },

      toggleTheme: () => {
        const { resolvedTheme } = get()
        const newTheme = resolvedTheme === "light" ? "dark" : "light"
        get().setTheme(newTheme)
      },

      setSystemTheme: (systemTheme) => {
        const { theme } = get()
        const resolvedTheme = theme === "system" ? systemTheme : theme
        set({ systemTheme, resolvedTheme })
      },
    }),
    {
      name: "theme-preference",
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
)
