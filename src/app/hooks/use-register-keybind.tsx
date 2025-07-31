import { useEffect } from "react"

import type { Keybind } from "@/app/stores/keybind/types"
import { keybindStore } from "../stores/keybind/store"

type UseRegisterKeybindParams = Keybind

export function useRegisterKeybind(params: UseRegisterKeybindParams) {
  const registerKeybind = keybindStore((state) => state.registerKeybind)

  useEffect(() => {
    registerKeybind({
      ...params,
    })
  }, [registerKeybind, params])
}
