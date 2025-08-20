import { useCallback, useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useLocation } from "@tanstack/react-router"
import { Check, Settings, Wrench } from "lucide-react"

import { useRegisterKeybind } from "@/app/stores/keybind.store"
import { useModeStore } from "@/app/stores/mode.store"
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

export function ModeMenu() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const currentMode = useModeStore((state) => state.currentMode)
  const setCurrentMode = useModeStore((state) => state.setCurrentMode)
  const setAvailableModes = useModeStore((state) => state.setAvailableModes)
  const getVisibleAgents = useModeStore((state) => state.getVisibleAgents)
  const cycleAllAgents = useModeStore((state) => state.cycleAllAgents)
  const isOpen = useModeStore((state) => state.isOpen)
  const setModeOpen = useModeStore((state) => state.setOpen)

  const { data: agents } = useQuery(api.app.agents.queryOptions())
  const isOnAllowedRoute =
    location.pathname === "/" || location.pathname.startsWith("/session/")

  useEffect(() => {
    if (agents) {
      setAvailableModes(agents)
    }
  }, [agents, setAvailableModes])

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  useRegisterKeybind({
    id: "toggle-mode-menu",
    keys: {
      darwin: "cmd+shift+l",
      win32: "ctrl+shift+l",
      linux: "ctrl+shift+l",
    },
    description: "Open mode picker",
    callback: useCallback(() => setModeOpen(!isOpen), [isOpen, setModeOpen]),
  })

  useRegisterKeybind({
    id: "toggle-plan-build-mode",
    keys: {
      darwin: "cmd+l",
      win32: "ctrl+l",
      linux: "ctrl+l",
    },
    description: "Cycle through all agents",
    callback: useCallback(() => cycleAllAgents(), [cycleAllAgents]),
  })

  const handleModeSelect = useCallback(
    (modeName: string) => {
      setCurrentMode(modeName)
      setModeOpen(false)
    },
    [setCurrentMode, setModeOpen],
  )

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setModeOpen(open)
    },
    [setModeOpen],
  )

  const ModeIcon = ({ modeName }: { modeName: string }) => {
    switch (modeName.toLowerCase()) {
      case "plan":
        return <Settings className="h-3 w-3" />
      case "build":
        return <Wrench className="h-3 w-3" />
      default:
        return <Settings className="h-3 w-3" />
    }
  }

  if (!isOnAllowedRoute) {
    return null
  }

  return (
    <CommandDialog open={open} onOpenChange={handleOpenChange}>
      <CommandInput placeholder="Search modes..." />
      <CommandList>
        <CommandEmpty>No modes found.</CommandEmpty>
        <CommandGroup heading="Available Modes">
          {getVisibleAgents().map((agent) => {
            const isSelected = currentMode === agent.name
            const displayName =
              agent.name.charAt(0).toUpperCase() + agent.name.slice(1)

            return (
              <CommandItem
                key={agent.name}
                onSelect={() => handleModeSelect(agent.name)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  {isSelected && <Check className="h-4 w-4" />}
                  <div className="flex items-center gap-2">
                    <ModeIcon modeName={agent.name} />
                    <span className="font-medium capitalize">
                      {displayName}
                    </span>
                    {agent.mode === "subagent" && (
                      <Badge variant="outline" className="text-xs">
                        Subagent
                      </Badge>
                    )}
                  </div>
                </div>
                <div
                  className="text-muted-foreground flex items-center gap-1
                    text-xs"
                >
                  {agent.model?.modelID && <span>{agent.model.modelID}</span>}
                  {agent.temperature && <span>T:{agent.temperature}</span>}
                </div>
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
