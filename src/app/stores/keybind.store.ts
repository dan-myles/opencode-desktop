"use no memo"

import { useEffect, useMemo } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import type {
  Keybind,
  KeybindDefinition,
  KeybindId,
} from "@/app/components/providers/keybind.types"
import { getCurrentPlatform } from "@/app/lib/utils"

interface KeybindStore {
  definitions: Map<KeybindId, KeybindDefinition>
  callbacks: Map<KeybindId, (() => Promise<void>) | (() => void)>
  registerKeybind: (keybind: Keybind) => void
  getKeybindList: () => Keybind[]
  getKeybindMap: () => Map<string, Keybind>
}

export const useKeybindStore = create<KeybindStore>()(
  persist(
    (set, get) => ({
      definitions: new Map(),
      callbacks: new Map(),

      registerKeybind: (keybind) => {
        const { callback, ...definition } = keybind

        set((state) => ({
          definitions: new Map(state.definitions).set(keybind.id, definition),
          callbacks: new Map(state.callbacks).set(keybind.id, callback),
        }))
      },

      getKeybindList: () => {
        const { definitions, callbacks } = get()
        const currentPlatform = getCurrentPlatform()

        return Array.from(definitions.values())
          .filter((def) => def.keys[currentPlatform])
          .map((def) => ({
            ...def,
            callback: callbacks.get(def.id) || (() => {}),
          }))
      },

      getKeybindMap: () => {
        const { definitions, callbacks } = get()
        const currentPlatform = getCurrentPlatform()
        const map = new Map<string, Keybind>()

        definitions.forEach((definition) => {
          const platformKey = definition.keys[currentPlatform]
          if (platformKey) {
            const callback = callbacks.get(definition.id) || (() => {})
            const normalizedKey = normalizeKeybindString(platformKey)
            map.set(normalizedKey, { ...definition, callback })
          }
        })

        return map
      },
    }),
    {
      name: "keybind-store",
      partialize: (state) => ({
        definitions: Array.from(state.definitions.entries()),
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.definitions)) {
          state.definitions = new Map(
            state.definitions as [KeybindId, KeybindDefinition][],
          )
        }
      },
    },
  ),
)

export function useRegisterKeybind(keybind: Keybind) {
  const registerKeybind = useKeybindStore((state) => state.registerKeybind)

  useEffect(() => {
    registerKeybind(keybind)
    // eslint-disable-next-line react-hooks/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerKeybind, keybind.callback, JSON.stringify(keybind)])
}

export function useKeybindList() {
  const getBinds = useKeybindStore((state) => state.getKeybindList)
  return useMemo(() => getBinds(), [getBinds])
}

function normalizeKeybindString(keybindString: string): string {
  const parts = keybindString
    .toLowerCase()
    .split("+")
    .map((s) => s.trim())
  const key = parts.pop()
  const modifiers = parts.filter((p) => p !== key).sort()

  return [...modifiers, key].join("+")
}
