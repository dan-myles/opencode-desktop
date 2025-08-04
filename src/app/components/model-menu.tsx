import { useCallback, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useLocation } from "@tanstack/react-router"
import { Check, Cpu, Eye, Wrench, Zap } from "lucide-react"

import type { Model } from "@/server/routers/config/types"
import { useRegisterKeybind } from "@/app/stores/keybind.store"
import { useModelStore } from "@/app/stores/model.store"
import { api } from "../lib/api"
import { Badge } from "./ui/badge"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command"

export function ModelMenu() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const currentModel = useModelStore((state) => state.currentModel)
  const setCurrentModel = useModelStore((state) => state.setCurrentModel)
  const { data: providersData } = useQuery(api.config.providers.queryOptions())
  const isOnAllowedRoute =
    location.pathname === "/" || location.pathname.startsWith("/session/")

  useRegisterKeybind({
    id: "toggle-model-menu",
    keys: {
      darwin: "cmd+l",
      win32: "ctrl+l",
      linux: "ctrl+l",
    },
    description: "Toggle model menu",
    callback: useCallback(() => setOpen((open) => !open), [setOpen]),
  })

  const handleModelSelect = useCallback(
    (providerID: string, modelID: string) => {
      setCurrentModel({ providerID, modelID })
      setOpen(false)
    },
    [setCurrentModel],
  )

  const ModelCapabilityIcons = ({ model }: { model: Model }) => {
    const icons = []
    if (model.reasoning) icons.push(<Cpu key="reasoning" className="h-3 w-3" />)
    if (model.tool_call) icons.push(<Wrench key="tools" className="h-3 w-3" />)
    if (model.attachment) icons.push(<Eye key="vision" className="h-3 w-3" />)
    if (model.temperature) icons.push(<Zap key="temp" className="h-3 w-3" />)
    return <>{icons}</>
  }

  if (!isOnAllowedRoute) {
    return null
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search models..." />
      <CommandList>
        <CommandEmpty>No models found.</CommandEmpty>
        {providersData?.providers.map((provider) => (
          <CommandGroup key={provider.id} heading={provider.name}>
            {Object.entries(provider.models).map(([modelId, model]) => {
              const isSelected =
                currentModel?.providerID === provider.id &&
                currentModel?.modelID === modelId
              const isDefault = providersData.default[provider.id] === modelId

              return (
                <CommandItem
                  key={`${provider.id}/${modelId}`}
                  onSelect={() => handleModelSelect(provider.id, modelId)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {isSelected && <Check className="h-4 w-4" />}
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {model.name}{" "}
                        <span className="text-muted-foreground">
                          {provider.name}
                        </span>
                      </span>
                      {isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>{" "}
                  </div>
                  <div className="flex items-center gap-1">
                    <ModelCapabilityIcons model={model} />
                  </div>{" "}
                </CommandItem>
              )
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
