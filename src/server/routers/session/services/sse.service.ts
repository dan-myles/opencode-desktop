import { EventEmitter } from "events"
import { EventSource } from "eventsource"

class SSEService extends EventEmitter {
  private isConnected = false
  private eventSource: EventSource | null = null

  constructor() {
    super()
    this.eventSource = new EventSource("http://localhost:4096/event")
    this.eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log("💬 Message event:", data)
    }
  }

  lol() {
    console.log("HELLO!")
  }
}

export const sseService = new SSEService()
