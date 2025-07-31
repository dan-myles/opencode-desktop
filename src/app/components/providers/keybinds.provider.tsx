import type { ReactNode } from "react"
import { useEffect } from "react"

import { useKeybindMap } from "@/app/stores/keybind/store"

interface KeybindsProviderProps {
  children: ReactNode
}

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/\s+/g, "")
}

function createEventKeybindLookupString(event: KeyboardEvent): string {
  const eventModifiers: string[] = []
  if (event.ctrlKey) eventModifiers.push("ctrl")
  if (event.metaKey) eventModifiers.push("cmd")
  if (event.altKey) eventModifiers.push("alt")
  if (event.shiftKey) eventModifiers.push("shift")

  const eventKey = normalizeKey(event.key)

  const sortedParts = [...eventModifiers, eventKey].sort()

  return sortedParts.join("+")
}

export function KeybindsProvider({ children }: KeybindsProviderProps) {
  const activeKeybindsMap = useKeybindMap()

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
      const matchedKeybind = activeKeybindsMap.get(eventKeybindString)

      if (matchedKeybind) {
        event.preventDefault()
        event.stopPropagation()
        matchedKeybind.callback()
      }
    }

    document.addEventListener("keydown", handleKeyDown, true)

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true)
    }
  }, [activeKeybindsMap])

  return <>{children}</>
}
