import { existsSync } from "node:fs"
import { join } from "node:path"
import type { ChildProcess } from "node:child_process"
import { app } from "electron"

// Store the server process reference
export let opencodeServerProcess: ChildProcess | null = null

// Setter for the server process (used by mutations)
export function setOpencodeServerProcess(process: ChildProcess | null) {
  opencodeServerProcess = process
}

// Helper function to get the opencode binary path
export function getOpencodeBinaryPath(): string {
  const isDev = process.env.NODE_ENV === "development"

  if (isDev) {
    // In development, assume opencode is in PATH or provide a local path
    return "opencode"
  } else {
    // In production, the binary is packaged as an extra resource
    const resourcesPath = process.resourcesPath
    const binaryPath = join(resourcesPath, "bin", "opencode")
    return binaryPath
  }
}

// Helper function to check if opencode binary exists and is accessible
export function validateBinaryPath(binaryPath: string): boolean {
  if (binaryPath === "opencode") {
    // For development, we assume it's in PATH
    return true
  }
  return existsSync(binaryPath)
}

// Check if server is currently running
export function isServerRunning(): boolean {
  return opencodeServerProcess !== null && !opencodeServerProcess.killed
}

// Get server process info
export function getServerProcessInfo() {
  return {
    process: opencodeServerProcess,
    isRunning: isServerRunning(),
    pid: isServerRunning() ? opencodeServerProcess?.pid : null,
  }
}

// Clean up server process when the app is closing
app.on("before-quit", () => {
  if (opencodeServerProcess && !opencodeServerProcess.killed) {
    opencodeServerProcess.kill("SIGTERM")
  }
})