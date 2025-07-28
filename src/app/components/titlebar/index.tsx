import { useState } from "react"

import type { WindowState } from "@/state"
import { useRendererListener } from "@/app/hooks/use-renderer-listener"
import { MenuChannels } from "@/channels/menu-channels"
import Menu from "./menu"
import WindowControls from "./window-controls"

const handleDoubleClick = () => {
  electron.ipcRenderer.invoke(MenuChannels.WINDOW_TOGGLE_MAXIMIZE)
}

export default function Titlebar() {
  const [windowState, setWindowState] = useState<WindowState>("normal")

  useRendererListener("window-state-changed", (_, windowState: WindowState) =>
    setWindowState(windowState),
  )

  // Hide titlebar in full screen mode on macOS
  if (windowState === "full-screen" && __DARWIN__) {
    return null
  }

  return (
    <div onDoubleClick={handleDoubleClick} className="window-titlebar">
      {__WIN32__ && (
        <>
          <Menu />
          <WindowControls windowState={windowState} />
        </>
      )}
    </div>
  )
}
