import { EventEmitter } from "events"
import { EventSource } from "eventsource"

import type { Event } from "@/server/sdk/gen/types.gen"

class SSEService extends EventEmitter {
  private eventSource: EventSource | null = null

  constructor() {
    super()
    this.connect()
  }

  private connect() {
    this.eventSource = new EventSource("http://localhost:4096/event")

    this.eventSource.onmessage = (event) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const data = JSON.parse(event.data) as Event
        this.emit("event", data)
      } catch (error) {
        console.error("Failed to parse SSE event:", error)
      }
    }

    this.eventSource.onerror = (error) => {
      console.error("SSE connection error:", error)
    }

    this.eventSource.onopen = () => {
      console.log("SSE connection opened")
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }
  }

  reconnect() {
    this.disconnect()
    this.connect()
  }
}

export const sseService = new SSEService()
