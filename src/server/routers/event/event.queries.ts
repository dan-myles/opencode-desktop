export async function getEventSubscriptionInfo() {
  // SSE endpoints require special handling outside of normal HTTP requests
  // Return connection info for the client to establish SSE connection
  const baseUrl = "http://localhost:4096"
  return {
    url: `${baseUrl}/event`,
    message:
      "Use EventSource API to connect to this endpoint for server-sent events",
  }
}
