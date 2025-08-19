"use no memo"

import { create } from "zustand"

import type { Event } from "@/server/sdk/gen/types.gen"

interface SessionState {
  isIdle: boolean
  lastActivity?: number
}

interface SessionStateStore {
  // State
  sessions: Record<string, SessionState>
  isConnected: boolean

  // Actions
  setSessionIdle: (sessionId: string) => void
  setSessionGenerating: (sessionId: string) => void
  removeSession: (sessionId: string) => void

  // Selectors
  isSessionIdle: (sessionId: string) => boolean
  isSessionGenerating: (sessionId: string) => boolean

  // Internal
  _eventSource: EventSource | null
  _connect: () => void
  _disconnect: () => void
  _handleEvent: (event: Event) => void
}

export const useSessionStateStore = create<SessionStateStore>()((set, get) => {
  let eventSource: EventSource | null = null

  const connect = () => {
    if (eventSource) return

    eventSource = new EventSource("http://localhost:4096/event")

    eventSource.onmessage = (event) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const data = JSON.parse(event.data) as Event
        get()._handleEvent(data)
      } catch (error) {
        console.error("Failed to parse SSE event:", error)
      }
    }

    eventSource.onopen = () => {
      console.log("SessionState SSE connection opened")
      set({ isConnected: true })
    }

    eventSource.onerror = (error) => {
      console.error("SessionState SSE connection error:", error)
      set({ isConnected: false })
    }
  }

  const disconnect = () => {
    if (eventSource) {
      eventSource.close()
      eventSource = null
      set({ isConnected: false })
    }
  }

  const handleEvent = (event: Event) => {
    switch (event.type) {
      case "session.idle": {
        const sessionId = event.properties.sessionID
        get().setSessionIdle(sessionId)
        break
      }
      default:
        // Only handle session-related events
        break
    }
  }

  // Auto-connect on store creation
  connect()

  return {
    sessions: {},
    isConnected: false,
    _eventSource: eventSource,

    setSessionIdle: (sessionId) => {
      set((state) => ({
        sessions: {
          ...state.sessions,
          [sessionId]: { isIdle: true, lastActivity: Date.now() },
        },
      }))
    },

    setSessionGenerating: (sessionId) => {
      set((state) => ({
        sessions: {
          ...state.sessions,
          [sessionId]: { isIdle: false, lastActivity: Date.now() },
        },
      }))
    },

    removeSession: (sessionId) =>
      set((state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [sessionId]: removed, ...rest } = state.sessions
        return { sessions: rest }
      }),

    isSessionIdle: (sessionId) => get().sessions[sessionId]?.isIdle ?? true,
    isSessionGenerating: (sessionId) => !get().isSessionIdle(sessionId),

    _connect: connect,
    _disconnect: disconnect,
    _handleEvent: handleEvent,
  }
})
