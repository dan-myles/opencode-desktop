"use no memo"

import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { Agent } from "@/server/sdk/gen/types.gen"

interface ModeStore {
  currentMode: string | null
  availableModes: Agent[]
  isOpen: boolean

  setCurrentMode: (mode: string | null) => void
  setAvailableModes: (modes: Agent[]) => void
  setOpen: (open: boolean) => void
  cycleAllAgents: () => void
  initializeDefaultMode: () => void
  getVisibleAgents: () => Agent[]

  getCurrentModeInfo: () => Agent | null
}

export const useModeStore = create<ModeStore>()(
  persist(
    (set, get) => ({
      currentMode: null,
      availableModes: [],
      isOpen: false,

      setCurrentMode: (mode) => set({ currentMode: mode }),

      setAvailableModes: (modes) => {
        set({ availableModes: modes })
        // Auto-initialize default mode if not set
        const { currentMode } = get()
        if (!currentMode && modes.length > 0) {
          get().initializeDefaultMode()
        }
      },

      setOpen: (open) => set({ isOpen: open }),

      getVisibleAgents: () => {
        const { availableModes } = get()
        return availableModes.filter((agent) => agent.name !== "general")
      },

      cycleAllAgents: () => {
        const visibleAgents = get().getVisibleAgents()
        const { currentMode } = get()
        if (visibleAgents.length === 0) return

        const currentIndex = visibleAgents.findIndex(
          (agent) => agent.name === currentMode,
        )
        const nextIndex = (currentIndex + 1) % visibleAgents.length
        set({ currentMode: visibleAgents[nextIndex].name })
      },

      initializeDefaultMode: () => {
        const { availableModes } = get()
        const buildAgent = availableModes.find(
          (agent) => agent.name === "build",
        )
        if (buildAgent) {
          set({ currentMode: "build" })
        } else if (availableModes.length > 0) {
          // Fallback to first agent if no "build" found
          set({ currentMode: availableModes[0].name })
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
