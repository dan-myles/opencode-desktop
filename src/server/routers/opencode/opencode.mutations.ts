import { spawn } from "node:child_process"

import {
  getOpencodeBinaryPath,
  getServerProcessInfo,
  isServerRunning,
  setOpencodeServerProcess,
  validateBinaryPath,
} from "./server"
import { StartMutation } from "./types"

// Start the server when file is imported
startServer({ port: 3000, host: "localhost" })

export async function startServer(input: StartMutation) {
  // Check if server is already running
  if (isServerRunning()) {
    const { pid } = getServerProcessInfo()
    return {
      success: false,
      message: "Server is already running",
      pid,
    }
  }

  const binaryPath = getOpencodeBinaryPath()

  // Validate binary exists
  if (!validateBinaryPath(binaryPath)) {
    return {
      success: false,
      message: `Opencode binary not found at: ${binaryPath}`,
    }
  }

  try {
    // Start the opencode server
    const serverProcess = spawn(
      binaryPath,
      ["serve", "--port", input.port.toString(), "--hostname", input.host],
      {
        stdio: ["pipe", "pipe", "pipe"],
        detached: false,
      },
    )

    // Set the global process reference
    setOpencodeServerProcess(serverProcess)

    // Handle process events
    serverProcess.on("error", (error) => {
      console.error("Failed to start opencode server:", error)
    })

    serverProcess.on("exit", (code, signal) => {
      console.log(
        `Opencode server exited with code ${code} and signal ${signal}`,
      )
      setOpencodeServerProcess(null)
    })

    // Capture stdout and stderr for logging
    if (serverProcess.stdout) {
      serverProcess.stdout.on("data", (data) => {
        console.log(`Opencode stdout: ${data}`)
      })
    }

    if (serverProcess.stderr) {
      serverProcess.stderr.on("data", (data) => {
        console.error(`Opencode stderr: ${data}`)
      })
    }

    // Give the process a moment to start
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if process is still running
    if (isServerRunning()) {
      return {
        success: true,
        message: "Opencode server started successfully",
        pid: serverProcess.pid,
        url: `http://${input.host}:${input.port}`,
      }
    } else {
      return {
        success: false,
        message: "Server process exited immediately after starting",
      }
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to start server: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

export function stopServer() {
  const { process: serverProcess } = getServerProcessInfo()

  if (!isServerRunning() || !serverProcess) {
    return {
      success: false,
      message: "No server process is currently running",
    }
  }

  try {
    // Gracefully terminate the process
    serverProcess.kill("SIGTERM")

    // Force kill after 5 seconds if it doesn't terminate gracefully
    setTimeout(() => {
      if (isServerRunning() && serverProcess) {
        serverProcess.kill("SIGKILL")
      }
    }, 5000)

    return {
      success: true,
      message: "Server stop signal sent",
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to stop server: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

