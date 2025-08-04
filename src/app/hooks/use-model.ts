import { use } from "react"

import { ModelContext } from "@/app/components/providers/model.provider"

export function useModel() {
  const ctx = use(ModelContext)
  if (!ctx) {
    throw new Error("useModel must be used within a ModelProvider")
  }

  return ctx
}
