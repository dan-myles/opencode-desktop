import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

import type { Keybind, KeybindDefinition, KeybindId } from "./keybind.types"
import { getCurrentPlatform } from "@/app/lib/utils"

interface KeybindContextValue {
  registerKeybind: (keybind: Keybind) => void
  keybindList: Keybind[]
  keybindMap: Map<string, Keybind>
}

const KEYBIND_LOCALSTORAGE_KEY = "keybind-store"

export const KeybindContext = createContext<KeybindContextValue | null>(null)

export function KeybindProvider({ children }: { children: ReactNode }) {
  const [keybinds, setKeybinds] = useState<Map<KeybindId, KeybindDefinition>>(
    () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(KEYBIND_LOCALSTORAGE_KEY)
        return stored !== null ? JSON.parse(stored) : new Map()
      }

      return new Map()
    },
  )

  const [callbacks, setCallbacks] = useState<Map<KeybindId, () => void>>(
    new Map(),
  )

  const registerKeybind = useCallback((keybind: Keybind) => {
    const { callback, ...definition } = keybind

    setKeybinds((prev) => {
      const newMap = new Map(prev)
      newMap.set(keybind.id, definition)
      return newMap
    })

    setCallbacks((prev) => {
      const newMap = new Map(prev)
      newMap.set(keybind.id, callback)
      return newMap
    })
  }, [])

  const keybindList = useMemo(() => {
    const currentPlatform = getCurrentPlatform()
    return Array.from(keybinds.values())
      .filter((def) => def.keys[currentPlatform])
      .map((def) => ({
        ...def,
        callback: callbacks.get(def.id) || (() => {}),
      }))
  }, [keybinds, callbacks])

  const keybindMap = useMemo(() => {
    const currentPlatform = getCurrentPlatform()
    const map = new Map<string, Keybind>()

    keybinds.forEach((definition) => {
      const platformKey = definition.keys[currentPlatform]
      if (platformKey) {
        const callback = callbacks.get(definition.id) || (() => {})
        const normalizedKey = normalizeKeybindString(platformKey)
        map.set(normalizedKey, { ...definition, callback })
      }
    })

    return map
  }, [keybinds, callbacks])

  useEffect(() => {
    try {
      const serialized = Array.from(keybinds.entries())
      localStorage.setItem(KEYBIND_LOCALSTORAGE_KEY, JSON.stringify(serialized))
    } catch (error) {
      console.warn("Failed to save keybind definitions to localStorage:", error)
    }
  }, [keybinds])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      if (
        target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA"
      ) {
        return
      }

      const eventKeybindString = createEventKeybindLookupString(event)
      const matchedKeybind = keybindMap.get(eventKeybindString)

      if (matchedKeybind) {
        event.preventDefault()
        event.stopPropagation()
        matchedKeybind.callback()
      }
    }

    document.addEventListener("keydown", handleKeyDown, true)
    return () => document.removeEventListener("keydown", handleKeyDown, true)
  }, [keybindMap])

  const value = useMemo(
    () => ({
      registerKeybind,
      keybindList,
      keybindMap,
    }),
    [registerKeybind, keybindList, keybindMap],
  )

  return (
    <KeybindContext.Provider value={value}>{children}</KeybindContext.Provider>
  )
}

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/\s+/g, "")
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

function createEventKeybindLookupString(event: KeyboardEvent): string {
  const eventModifiers: string[] = []
  if (event.ctrlKey) eventModifiers.push("ctrl")
  if (event.metaKey) eventModifiers.push("cmd")
  if (event.altKey) eventModifiers.push("alt")
  if (event.shiftKey) eventModifiers.push("shift")

  const eventKey = normalizeKey(event.key)
  const sortedModifiers = eventModifiers.sort()
  return [...sortedModifiers, eventKey].join("+")
}
