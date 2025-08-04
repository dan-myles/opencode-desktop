"use no memo"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ModelState {
  providerID: string
  modelID: string
}

interface ModelStore {
  currentModel: ModelState | null
  setCurrentModel: (model: ModelState | null) => void
}

export const useModelStore = create<ModelStore>()(
  persist(
    (set) => ({
      currentModel: null,
      setCurrentModel: (model) => set({ currentModel: model }),
    }),
    {
      name: "model-preference",
    },
  ),
)
