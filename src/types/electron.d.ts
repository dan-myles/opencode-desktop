export interface API {
  getOpencodeBinaryPath: () => Promise<string>
}

declare global {
  interface Window {
    api: API
  }
}

