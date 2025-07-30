import { getOpencodeBinaryPath, validateBinaryPath, getServerProcessInfo } from "./server"

export function getBinaryInfo() {
  const binaryPath = getOpencodeBinaryPath()
  const isValid = validateBinaryPath(binaryPath)

  return {
    path: binaryPath,
    exists: isValid,
    isDev: process.env.NODE_ENV === "development",
  }
}

export function getServerStatus() {
  const { isRunning, pid } = getServerProcessInfo()

  return {
    isRunning,
    pid,
    uptime: isRunning ? process.uptime() : null,
  }
}