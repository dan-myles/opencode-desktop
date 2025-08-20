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
      case "plan":
        return "border-blue-500/50 bg-blue-500/10 text-blue-600 hover:border-blue-500 hover:bg-blue-500/20"
      case "build":
        return "border-green-500/50 bg-green-500/10 text-green-600 hover:border-green-500 hover:bg-green-500/20"
      default:
        return "border-purple-500/50 bg-purple-500/10 text-purple-600 hover:border-purple-500 hover:bg-purple-500/20"
    }
  }

  const getModeIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case "plan":
        return <Settings className="h-3 w-3" />
      case "build":
        return <Wrench className="h-3 w-3" />
      default:
        return <Settings className="h-3 w-3" />
    }
  }

  return (
    <div className="pointer-events-auto absolute top-full right-4 -mt-3">
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          `-z-20 min-w-[4rem] cursor-pointer rounded-full border px-3 py-1.5
          shadow-lg backdrop-blur-md transition-all outline-none
          hover:ring-[3px] hover:ring-current/20 focus-visible:ring-[3px]
          focus-visible:ring-current/20 active:ring-[3px]
          active:ring-current/30`,
          getModeColor(currentMode),
        )}
        role="button"
        tabIndex={0}
        title={`Current mode: ${currentMode} (Cmd+Shift+L to change)`}
      >
        <div
          className="flex items-center justify-center gap-1.5 text-xs
            font-medium"
        >
          {getModeIcon(currentMode)}
          <span className="capitalize">{currentMode}</span>
        </div>
      </div>
    </div>
  )
}
