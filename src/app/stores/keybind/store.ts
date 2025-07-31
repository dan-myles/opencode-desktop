import { useMemo } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { Keybind, KeybindState, PersistedKeybind } from "./types"
import { getCurrentPlatform } from "@/app/lib/utils"

const callbackRegistry = new Map<string, () => void>()

export const keybindStore = create<KeybindState>()(
  persist(
    (set, get) => ({
      keybinds: new Map<string, PersistedKeybind>(),

      registerKeybind: (keybind: Keybind) => {
        // Store callback in registry (not persisted)
        callbackRegistry.set(keybind.id, keybind.callback)

        // Store metadata in Zustand (persisted)
        set((state) => {
          const newKeybinds = new Map(state.keybinds)
          const { callback, ...persistedKeybind } = keybind

          if (keybind.override || !newKeybinds.has(keybind.id)) {
            newKeybinds.set(keybind.id, persistedKeybind)
          }

          return { keybinds: newKeybinds }
        })
      },

      getKeybindList: () => {
        // Combine persisted data with callbacks from registry
        return Array.from(get().keybinds.values()).map((keybind) => ({
          ...keybind,
          callback: callbackRegistry.get(keybind.id) || (() => {}),
        }))
      },
    }),
    {
      name: "keybind-store",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null

          const parsed = JSON.parse(str)
          if (parsed.state?.keybinds) {
            parsed.state.keybinds = new Map(parsed.state.keybinds)
          }
          return parsed
        },
        setItem: (name, value) => {
          const serialized = {
            ...value,
            state: {
              ...value.state,
              keybinds: Array.from(value.state.keybinds.entries()),
            },
          }
          localStorage.setItem(name, JSON.stringify(serialized))
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
)

// Export hook for registering keybinds
export const useRegisterKeybind = () =>
  keybindStore((state) => state.registerKeybind)

// Export hook that returns platform-filtered keybind array with stable references
export const useKeybindList = () => {
  const keybindsMap = keybindStore((state) => state.keybinds)
  const getKeybindList = keybindStore((state) => state.getKeybindList)

  return useMemo(() => {
    const currentPlatform = getCurrentPlatform()
    const allKeybinds = getKeybindList()
    return allKeybinds.filter((keybind) => keybind.platform === currentPlatform)
  }, [keybindsMap, getKeybindList])
}
