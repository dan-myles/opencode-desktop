import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { Keybind, KeybindState, PersistedKeybind } from "./types"
import { Platform } from "./types"

// Global callback registry
const callbackRegistry = new Map<string, () => void>()

const keybindStore = create<KeybindState>()(
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

export const useRegisterKeybind = () =>
  keybindStore((state) => state.registerKeybind)

export const useKeybindList = () =>
  keybindStore((state) => state.getKeybindList)

function getCurrentPlatform(): Platform {
  if (typeof __DARWIN__ !== "undefined" && __DARWIN__) return Platform.DARWIN
  if (typeof __WIN32__ !== "undefined" && __WIN32__) return Platform.WIN32
  if (typeof __LINUX__ !== "undefined" && __LINUX__) return Platform.LINUX

  if (typeof navigator !== "undefined") {
    const userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.includes("mac")) return Platform.DARWIN
    if (userAgent.includes("win")) return Platform.WIN32
    return Platform.LINUX
  }

  return Platform.LINUX
}

export const useKeybindListAccessor = () => {
  const getKeybindList = useKeybindList()
  const currentPlatform = getCurrentPlatform()

  return () =>
    getKeybindList().filter((keybind) => keybind.platform === currentPlatform)
}
