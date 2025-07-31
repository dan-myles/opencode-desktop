import { useEffect } from "react"

import type { Keybind } from "@/app/stores/keybind/types"
import {
  useRegisterKeybind as useRK,
} from "@/app/stores/keybind/store"

type UseRegisterKeybindParams = Keybind

export function useRegisterKeybind(params: UseRegisterKeybindParams) {
  const register = useRK()

  useEffect(() => {
    register({
      ...params,
    })
  }, [params])
}
