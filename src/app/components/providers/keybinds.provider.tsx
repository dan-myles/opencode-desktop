import type { ReactNode } from "react"
import { useEffect } from "react"

import { useKeybindList } from "@/app/stores/keybind/store"

interface KeybindsProviderProps {
  children: ReactNode
}

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/\s+/g, "")
}

function parseKeybind(keybind: string): {
  modifiers: Set<string>
  key: string
} {
  if (!keybind || typeof keybind !== "string") {
    return { modifiers: new Set(), key: "" }
  }

  const parts = keybind.split("+").map((part) => part.trim().toLowerCase())
  const key = parts.pop() || ""
  const modifiers = new Set(parts)

  return { modifiers, key }
}

function matchesKeybind(event: KeyboardEvent, targetKeybind: string): boolean {
  if (!targetKeybind) return false

  const { modifiers: targetModifiers, key: targetKey } =
    parseKeybind(targetKeybind)
  const eventKey = normalizeKey(event.key)

  const eventModifiers = new Set<string>()
  if (event.ctrlKey) eventModifiers.add("ctrl")
  if (event.metaKey) eventModifiers.add("cmd")
  if (event.altKey) eventModifiers.add("alt")
  if (event.shiftKey) eventModifiers.add("shift")

  const modifiersMatch =
    targetModifiers.size === eventModifiers.size &&
    [...targetModifiers].every((mod) => eventModifiers.has(mod))

  const keyMatches = normalizeKey(targetKey) === eventKey

  return modifiersMatch && keyMatches
}

export function KeybindsProvider({ children }: KeybindsProviderProps) {
  // Use the single hook that returns platform-filtered keybind array
  const keybinds = useKeybindList()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      for (const keybind of keybinds) {
        if (keybind.key && matchesKeybind(event, keybind.key)) {
          event.preventDefault()
          event.stopPropagation()
          keybind.callback()
          break
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown, true)

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true)
    }
  }, [keybinds]) // React to changes in the keybind array

  return <>{children}</>
}
