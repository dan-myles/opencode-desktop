"use no memo"

import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { Mode } from "@/server/sdk/gen/types.gen"

interface ModeStore {
  currentMode: string | null
  availableModes: Mode[]
  isOpen: boolean

  setCurrentMode: (mode: string | null) => void
  setAvailableModes: (modes: Mode[]) => void
  setOpen: (open: boolean) => void
  togglePlanBuild: () => void

  getCurrentModeInfo: () => Mode | null
}

export const useModeStore = create<ModeStore>()(
  persist(
    (set, get) => ({
      currentMode: "build",
      availableModes: [],
      isOpen: false,

      setCurrentMode: (mode) => set({ currentMode: mode }),

      setAvailableModes: (modes) => set({ availableModes: modes }),

      setOpen: (open) => set({ isOpen: open }),

      togglePlanBuild: () => {
        const { currentMode } = get()
        if (currentMode === "plan") {
          set({ currentMode: "build" })
        } else {
          set({ currentMode: "plan" })
        }
      },

      getCurrentModeInfo: () => {
        const { currentMode, availableModes } = get()
        if (!currentMode) return null
        return availableModes.find((mode) => mode.name === currentMode) || null
      },
    }),
    {
      name: "mode-preference",
      partialize: (state) => ({
        currentMode: state.currentMode,
      }),
    },
  ),
)
