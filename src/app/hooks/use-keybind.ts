import { use, useEffect } from "react"

import { KeybindContext } from "@/app/components/providers/keybind.provider"
import { type Keybind } from "@/app/components/providers/keybind.types"

export function useKeybindMap() {
  const ctx = use(KeybindContext)
  if (!ctx) {
    throw new Error("useKeybind must be used within a KeybindProvider")
  }

  return ctx.keybindMap
}

export function useKeybindList() {
  const ctx = use(KeybindContext)
  if (!ctx) {
    throw new Error("useKeybind must be used within a KeybindProvider")
  }

  return ctx.keybindList
}

export function useRegisterKeybind(keybind: Keybind) {
  const ctx = use(KeybindContext)
  if (!ctx) {
    throw new Error("useKeybind must be used within a KeybindProvider")
  }

  useEffect(() => {
    ctx.registerKeybind(keybind)
    // eslint-disable-next-line react-hooks/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.registerKeybind, keybind.callback, JSON.stringify(keybind)])
}
