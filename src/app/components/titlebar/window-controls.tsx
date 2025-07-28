import { useCallback } from "react"

import type { WindowState } from "@/state"
import { cn } from "@/app/lib/utils"
import { MenuChannels } from "@/channels/menu-channels"
import { ControlButton } from "./control-button"

const MINIMIZE_SVG = "M 0,5 10,5 10,6 0,6 Z"
const MAXIMIZE_SVG = "M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z"
const RESTORE_SVG =
  "m 2,1e-5 0,2 -2,0 0,8 8,0 0,-2 2,0 0,-8 z m 1,1 6,0 0,6 -1,0 0,-5 -5,0 z m -2,2 6,0 0,6 -6,0 z"
const CLOSE_SVG =
  "M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z"

interface WindowControlsProps {
  windowState: WindowState
}

export default function WindowControls({ windowState }: WindowControlsProps) {
  const executeWindowCommand = useCallback(
    (command: string) => {
      electron.ipcRenderer.invoke(command, windowState)
    },
    [windowState],
  )

  return (
    <section className={cn("window-titlebar-controls", "type-win32")}>
      <ControlButton
        name="minimize"
        onClick={() => executeWindowCommand(MenuChannels.WINDOW_MINIMIZE)}
        path={MINIMIZE_SVG}
      />
      <ControlButton
        name={windowState === "maximized" ? "restore" : "maximize"}
        onClick={() =>
          executeWindowCommand(MenuChannels.WINDOW_TOGGLE_MAXIMIZE)
        }
        path={windowState === "maximized" ? RESTORE_SVG : MAXIMIZE_SVG}
      />
      <ControlButton
        name="close"
        onClick={() => executeWindowCommand(MenuChannels.WINDOW_CLOSE)}
        path={CLOSE_SVG}
      />
    </section>
  )
}
