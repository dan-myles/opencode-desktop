import path from "node:path"
import { app, BrowserWindow } from "electron"
import windowStateKeeper from "electron-window-state"
import { createIPCHandler } from "trpc-electron/main"

import { appRouter } from "./server/root"

let appWindow: BrowserWindow

/**
 * Create Application Window
 * @returns { BrowserWindow } Application Window Instance
 */
export function createAppWindow(): BrowserWindow {
  const minWidth = 960
  const minHeight = 660

  const savedWindowState = windowStateKeeper({
    defaultWidth: minWidth,
    defaultHeight: minHeight,
    maximize: false,
  })

  const windowOptions: Electron.BrowserWindowConstructorOptions = {
    x: savedWindowState.x,
    y: savedWindowState.y,
    width: savedWindowState.width,
    height: savedWindowState.height,
    minWidth,
    minHeight,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    backgroundColor: "#1a1a1a",
    webPreferences: {
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(import.meta.dirname, "preload.js"),
    },
  }

  if (process.platform === "darwin") {
    windowOptions.titleBarStyle = "hidden"
  }

  // Create new window instance
  appWindow = new BrowserWindow(windowOptions)

  // Load the index.html of the app window.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    appWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    appWindow.loadFile(
      path.join(
        import.meta.dirname,
        `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`,
      ),
    )
  }

  // Show window when is ready to
  appWindow.on("ready-to-show", () => {
    appWindow.show()
  })

  savedWindowState.manage(appWindow)

  // Close all windows when main window is closed
  appWindow.on("close", () => {
    appWindow = null!
    app.quit()
  })

  // Init TRPC link
  createIPCHandler({ router: appRouter, windows: [appWindow] })

  return appWindow
}
