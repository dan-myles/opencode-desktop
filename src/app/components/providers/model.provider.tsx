import type { ReactNode } from "react"
import { createContext, useState } from "react"

interface ModelState {
  providerID: string
  modelID: string
}

interface ModelContextType {
  currentModel: ModelState | null
  setCurrentModel: (model: ModelState) => void
}

export const ModelContext = createContext<ModelContextType | null>(null)

interface ModelProviderProps {
  children: ReactNode
}

export function ModelProvider({ children }: ModelProviderProps) {
  const [currentModel, setCurrentModel] = useState<ModelState | null>(null)

  return (
    <ModelContext.Provider value={{ currentModel, setCurrentModel }}>
      {children}
    </ModelContext.Provider>
  )
}
