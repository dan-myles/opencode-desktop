import type { ReactNode } from "react"
import { useEffect } from "react"

import { useKeybindStore } from "@/app/stores/keybind.store"

export function KeybindProvider({ children }: { children: ReactNode }) {
  const getKeybindMap = useKeybindStore((state) => state.getKeybindMap)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // NOTE: Do we want keybinds to be disabled while typing?
      // const target = event.target as HTMLElement
      // if (
      //   target.isContentEditable ||
      //   target.tagName === "INPUT" ||
      //   target.tagName === "TEXTAREA"
      // ) {
      //   return
      // }

      const eventKeybindString = createEventKeybindLookupString(event)
      const keybindMap = getKeybindMap()
      const matchedKeybind = keybindMap.get(eventKeybindString)

      if (matchedKeybind) {
        event.preventDefault()
        event.stopPropagation()
        matchedKeybind.callback()
      }
    }

    document.addEventListener("keydown", handleKeyDown, true)
    return () => document.removeEventListener("keydown", handleKeyDown, true)
  }, [getKeybindMap])

  return <>{children}</>
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
  const sortedModifiers = eventModifiers.sort()
  return [...sortedModifiers, eventKey].join("+")
}
