import { Route, HashRouter as Router, Routes } from "react-router-dom"

import { ThemeProvider } from "@/app/components/theme-provider"
import Titlebar from "@/app/components/titlebar/index"
import { useRendererListener } from "@/app/hooks/use-renderer-listener"
import { LandingScreen } from "@/app/screens/landing"
import { MenuChannels } from "@/channels/menu-channels"

const onMenuEvent = (
  _: Electron.IpcRendererEvent,
  channel: string,
  ...args: unknown[]
) => {
  electron.ipcRenderer.invoke(channel, args)
}

export default function App() {
  useRendererListener(MenuChannels.MENU_EVENT, onMenuEvent)

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <div className="flex h-full flex-col">
          <Titlebar />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" Component={LandingScreen} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}
