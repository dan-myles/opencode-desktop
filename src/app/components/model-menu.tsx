import { useCallback, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Check, Cpu, Eye, Wrench, Zap } from "lucide-react"

import type { Model } from "@/server/routers/config/types"
import { useRegisterKeybind } from "../hooks/use-keybind"
import { useModel } from "../hooks/use-model"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"

export function ModelMenu() {
  const [open, setOpen] = useState(false)
  const { currentModel, setCurrentModel } = useModel()
  const { data: providersData } = useQuery(api.config.providers.queryOptions())

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

  const getModelCapabilityIcons = (model: Model) => {
    const icons = []
    if (model.reasoning) {
      icons.push(
        <Tooltip key="reasoning">
          <TooltipTrigger asChild>
            <Cpu className="h-3 w-3" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Reasoning</p>
          </TooltipContent>
        </Tooltip>,
      )
    }
    if (model.tool_call) {
      icons.push(
        <Tooltip key="tools">
          <TooltipTrigger asChild>
            <Wrench className="h-3 w-3" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Tool Calling</p>
          </TooltipContent>
        </Tooltip>,
      )
    }
    if (model.attachment) {
      icons.push(
        <Tooltip key="vision">
          <TooltipTrigger asChild>
            <Eye className="h-3 w-3" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Vision</p>
          </TooltipContent>
        </Tooltip>,
      )
    }
    if (model.temperature) {
      icons.push(
        <Tooltip key="temp">
          <TooltipTrigger asChild>
            <Zap className="h-3 w-3" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Temperature Control</p>
          </TooltipContent>
        </Tooltip>,
      )
    }
    return icons
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
                  <TooltipProvider>
                    <div className="flex items-center gap-1">
                      {getModelCapabilityIcons(model)}
                    </div>
                  </TooltipProvider>{" "}
                </CommandItem>
              )
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
