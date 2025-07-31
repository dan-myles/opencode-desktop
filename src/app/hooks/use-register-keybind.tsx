import { useEffect } from "react"

import type { Keybind } from "@/app/stores/keybind/types"
import { useRegisterKeybind as useRegisterKeybindStore } from "@/app/stores/keybind/store"

type UseRegisterKeybindParams = Keybind

export function useRegisterKeybind(params: UseRegisterKeybindParams) {
  const registerKeybind = useRegisterKeybindStore()

  useEffect(() => {
    registerKeybind({
      ...params,
    })
  }, [registerKeybind, params])
}
