import { useQuery } from "@tanstack/react-query"

import { api } from "@/app/lib/api"
import { useKeybindStore } from "@/app/stores/keybind.store"
import { useModelStore } from "@/app/stores/model.store"

export function ModelIndicator() {
  const currentModel = useModelStore((state) => state.currentModel)
  const { data: providersData } = useQuery(api.config.providers.queryOptions())
  const callbacks = useKeybindStore((state) => state.callbacks)
  const toggleModelMenuCallback = callbacks.get("toggle-model-menu")

  const getModelInfo = () => {
    if (!providersData) return null

    let model = currentModel
    if (!model && providersData.default) {
      const firstProvider = Object.keys(providersData.default)[0]
      if (firstProvider) {
        model = {
          providerID: firstProvider,
          modelID: providersData.default[firstProvider],
        }
      }
    }

    if (!model) return null

    const provider = providersData.providers.find(
      (p) => p.id === model.providerID,
    )
    const modelData = provider?.models[model.modelID]

    return {
      providerName: provider?.name || model.providerID,
      modelName: modelData?.name || model.modelID,
    }
  }

  const handleClick = () => {
    toggleModelMenuCallback?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClick()
    }
  }

  const modelInfo = getModelInfo()

  if (!modelInfo) return null

  return (
    <div className="pointer-events-auto absolute top-full right-20 z-10 -mt-4">
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="bg-background/80 border-border hover:border-ring
          hover:ring-ring/50 active:border-ring active:ring-ring/70
          focus-visible:border-ring focus-visible:ring-ring/50 z-10
          cursor-pointer rounded-full border px-3 py-1.5 shadow-lg
          backdrop-blur-md transition-[color,box-shadow] outline-none
          hover:ring-[3px] focus-visible:ring-[3px] active:ring-[3px]"
        role="button"
        tabIndex={0}
        title="Click to change model (Cmd+L)"
      >
        <span className="text-xs">
          <span className="text-muted-foreground">
            {modelInfo.providerName}
          </span>{" "}
          <span className="text-foreground">{modelInfo.modelName}</span>
        </span>
      </div>
    </div>
  )
}
