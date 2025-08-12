import { useCallback, useMemo } from "react"
import { useLiveQuery } from "@tanstack/react-db"

import { messageManager } from "@/app/stores/message.collection"

export function useLiveMessages(sessionId: string) {
  // Get session-specific collection
  const sessionMessages = useMemo(
    () => messageManager.getSessionCollection(sessionId),
    [sessionId],
  )

  // Use live query for reactive data
  const { data: messages, isReady, collection } = useLiveQuery(sessionMessages)

  // Stub for sendMessage - we'll implement this later
  const sendMessage = useCallback(
    async (text: string) => {
      console.log(`Would send message: "${text}" to session: ${sessionId}`)
      // TODO: Implement actual message sending
    },
    [sessionId],
  )

  return {
    messages: messages || [],
    isReady,
    sendMessage,
    collection,
  }
}
