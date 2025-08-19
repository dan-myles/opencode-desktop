"use no memo"

import { create } from "zustand"

import type { Event, Message, Part } from "@/server/sdk/gen/types.gen"
import { trpcClient } from "@/app/lib/api"

export type MessageWithParts = {
  info: Message
  parts: Part[]
}

interface CurrentSessionMessagesStore {
  // State
  sessionId: string | null
  messages: Map<string, MessageWithParts>

  // Actions
  setCurrentSession: (sessionId: string) => Promise<void>
  addMessage: (message: MessageWithParts) => void
  updateMessagePart: (messageId: string, part: Part) => void
  loadInitialMessages: (sessionId: string) => Promise<void>

  // Internal
  _eventSource: EventSource | null
  _connect: () => void
  _disconnect: () => void
  _handleEvent: (event: Event) => void
}

export const useCurrentSessionMessagesStore =
  create<CurrentSessionMessagesStore>()((set, get) => {
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
        console.log("SessionMessages SSE connection opened")
      }

      eventSource.onerror = () => {
        console.error("SessionMessages SSE connection error")
      }
    }

    const disconnect = () => {
      if (eventSource) {
        eventSource.close()
        eventSource = null
      }
    }

    const handleEvent = (event: Event) => {
      const state = get()
      if (!state.sessionId) return

      switch (event.type) {
        case "message.updated": {
          const messageInfo = event.properties.info
          if (messageInfo.sessionID !== state.sessionId) return

          const foundParts = state.messages.get(messageInfo.id)?.parts

          get().addMessage({
            info: messageInfo,
            parts: foundParts ?? [],
          })
          break
        }

        case "message.part.updated": {
          const part = event.properties.part
          if (part.sessionID !== state.sessionId) return

          get().updateMessagePart(part.messageID, part)
          break
        }
      }
    }

    return {
      sessionId: null,
      messages: new Map(),
      _eventSource: eventSource,

      setCurrentSession: async (sessionId) => {
        const currentSessionId = get().sessionId
        if (currentSessionId === sessionId) return

        if (currentSessionId) {
          set({ messages: new Map() })
        }

        set({ sessionId })

        // Load initial messages first
        await get().loadInitialMessages(sessionId)

        // Then connect to SSE for new messages
        connect()
      },

      addMessage: (message) => {
        // Prevent duplicates from initial load + SSE overlap
        const existingMessage = get().messages.get(message.info.id)
        if (existingMessage) return

        // Use setState to properly notify React of Map changes
        set((prev) => ({
          messages: new Map(prev.messages).set(message.info.id, message),
        }))
      },

      updateMessagePart: (messageId, part) => {
        const state = get()
        const message = state.messages.get(messageId)
        if (!message) return

        const existingPartIdx = message.parts.findIndex((p) => p.id === part.id)
        const updatedParts =
          existingPartIdx >= 0
            ? message.parts.map((p, idx) =>
                idx === existingPartIdx ? part : p,
              )
            : [...message.parts, part]

        const updatedMessage = {
          ...message,
          parts: updatedParts,
        }

        // Use setState to properly notify React of Map changes
        set((prev) => ({
          messages: new Map(prev.messages).set(messageId, updatedMessage),
        }))
      },

      loadInitialMessages: async (sessionId) => {
        try {
          const existingMessages = await trpcClient.session.messages.query({
            id: sessionId,
          })

          // Add each message to the store
          existingMessages.forEach((message) => {
            get().addMessage({
              info: message.info,
              parts: message.parts,
            })
          })
        } catch (error) {
          console.error("Failed to load initial messages:", error)
        }
      },

      _connect: connect,
      _disconnect: disconnect,
      _handleEvent: handleEvent,
    }
  })
