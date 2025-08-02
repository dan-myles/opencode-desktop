// Event types from OpenAPI
export type Event = {
  type: string
  properties: any
}

// Note: SSE (Server-Sent Events) require special handling
// This is a placeholder for event subscription
export type EventSubscription = {
  url: string
  message: string
}
