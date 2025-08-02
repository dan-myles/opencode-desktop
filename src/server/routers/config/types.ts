// Response types from OpenAPI
export type Config = {
  $schema?: string
  theme?: string
  keybinds?: any
  share?: "manual" | "auto" | "disabled"
  autoshare?: boolean
  autoupdate?: boolean
  disabled_providers?: string[]
  model?: string
  small_model?: string
  username?: string
  mode?: Record<string, any>
  agent?: Record<string, any>
  provider?: Record<string, any>
  mcp?: Record<string, any>
  formatter?: Record<string, any>
  instructions?: string[]
  layout?: "auto" | "stretch"
  permission?: {
    edit?: "ask" | "allow"
    bash?: "ask" | "allow" | Record<string, "ask" | "allow">
  }
  experimental?: any
}

export type Provider = {
  api?: string
  name: string
  env: string[]
  id: string
  npm?: string
  models: Record<string, Model>
}

export type Model = {
  id: string
  name: string
  release_date: string
  attachment: boolean
  reasoning: boolean
  temperature: boolean
  tool_call: boolean
  cost: {
    input: number
    output: number
    cache_read?: number
    cache_write?: number
  }
  limit: {
    context: number
    output: number
  }
  options: Record<string, any>
}

export type ProvidersResponse = {
  providers: Provider[]
  default: Record<string, string>
}
