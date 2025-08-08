import { EventEmitter } from "events"
import { EventSource } from "eventsource"

class SSEService extends EventEmitter {
  private eventSource: EventSource | null = null

  constructor() {
    super()
    this.eventSource = new EventSource("http://localhost:4096/event")
    this.eventSource.onmessage = (event) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const data = JSON.parse(event.data) as unknown
      console.log("💬 Message event:", data)
    }
  }

  lol() {
    console.log("HELLO!")
  }
}

export const sseService = new SSEService()
