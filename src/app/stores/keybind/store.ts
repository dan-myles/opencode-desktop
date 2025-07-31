import { useMemo } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { Keybind, KeybindState, PersistedKeybind } from "./types"
import { getCurrentPlatform } from "@/app/lib/utils"

const callbackRegistry = new Map<string, () => void>()

const keybindStore = create<KeybindState>()(
  persist(
    (set, get) => ({
      keybinds: new Map<string, PersistedKeybind>(),

      registerKeybind: (keybind: Keybind) => {
        set((state) => {
          const id = `${keybind.id}-${keybind.platform}`
          callbackRegistry.set(id, keybind.callback)
          const newKeybinds = new Map(state.keybinds)
          const { callback, ...persistedKeybind } = keybind

          if (keybind.override || !newKeybinds.has(id)) {
            newKeybinds.set(id, persistedKeybind)
          }

          return { keybinds: newKeybinds }
        })
      },

      getKeybindList: () => {
        // Combine persisted data with callbacks from registry
        return Array.from(get().keybinds.values()).map((keybind) => ({
          ...keybind,
          callback:
            callbackRegistry.get(`${keybind.id}-${keybind.platform}`) ||
            (() => {}),
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

export const useRegisterKeybind = () =>
  keybindStore((state) => state.registerKeybind)

export const useKeybindList = () => {
  const keybindsMap = keybindStore((state) => state.keybinds)
  const expanded = Array.from(keybindsMap.values()).map((keybind) => {
    return {
      ...keybind,
      callback:
        callbackRegistry.get(`${keybind.id}-${keybind.platform}`) || (() => {}),
    }
  })

  return useMemo(() => {
    const filter = expanded.filter((k) => k.platform === getCurrentPlatform())
    return filter
  }, [keybindsMap])
}
