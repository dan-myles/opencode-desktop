import { Settings, Wrench } from "lucide-react"

import { cn } from "@/app/lib/utils"
import { useModeStore } from "@/app/stores/mode.store"

export function ModeIndicator() {
  const currentMode = useModeStore((state) => state.currentMode)
  const setOpen = useModeStore((state) => state.setOpen)

  const handleClick = () => {
    setOpen(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClick()
    }
  }

  if (!currentMode) return null

  const getModeColor = (mode: string) => {
    switch (mode.toLowerCase()) {
      case "build":
        return "bg-background/80 border-chart-2 text-chart-2 hover:border-chart-2 hover:ring-chart-2/50"
      case "plan":
        return "bg-background/80 border-chart-1 text-chart-1 hover:border-chart-1 hover:ring-chart-1/50"
      default:
        return "bg-background/80 border-chart-3 text-chart-3 hover:border-chart-3 hover:ring-chart-3/50"
    }
  }

  const getModeIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case "build":
        return <Wrench className="h-3 w-3" />
      case "plan":
        return <Settings className="h-3 w-3" />
      default:
        return <Settings className="h-3 w-3" />
    }
  }

  const toTitleCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  return (
    <div className="pointer-events-auto absolute top-full right-4 -mt-3">
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          `-z-20 min-w-[4rem] cursor-pointer rounded-full border px-3 py-1.5
          shadow-lg backdrop-blur-md transition-[color,box-shadow] outline-none
          hover:ring-[3px] focus-visible:ring-[3px] active:ring-[3px]`,
          getModeColor(currentMode),
        )}
        role="button"
        tabIndex={0}
        title={`Current mode: ${toTitleCase(currentMode)} (Cmd+Shift+L to change)`}
      >
        <div
          className="flex items-center justify-center gap-1.5 text-xs
            font-medium"
        >
          {getModeIcon(currentMode)}
          <span>{toTitleCase(currentMode)}</span>
        </div>
      </div>
    </div>
  )
}
