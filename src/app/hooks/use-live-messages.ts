import { useCallback, useMemo } from "react"
import { useLiveQuery } from "@tanstack/react-db"
import { useMutation } from "@tanstack/react-query"

import { api } from "@/app/lib/api"
import { messageManager } from "@/app/stores/message.collection"
import { useModelStore } from "@/app/stores/model.store"
import { useSessionStateStore } from "@/app/stores/session-state.store"

export function useLiveMessages(sessionId: string) {
  const sessionMessages = useMemo(
    () => messageManager.getSessionCollection(sessionId),
    [sessionId],
  )
  const { data: messages } = useLiveQuery(sessionMessages)
  const currentModel = useModelStore((state) => state.currentModel)
  const { setSessionGenerating } = useSessionStateStore()
  const chatMutation = useMutation(api.session.chat.mutationOptions())

  const sendMessage = useCallback(
    async (text: string) => {
      if (!currentModel) {
        throw new Error("No model selected. Please select a model first.")
      }

      try {
        setSessionGenerating(sessionId)

        await chatMutation.mutateAsync({
          id: sessionId,
          providerID: currentModel.providerID,
          modelID: currentModel.modelID,
          parts: [{ type: "text" as const, text }],
        })
      } catch (error) {
        console.error("Failed to send message:", error)
        throw error
      }
    },
    [sessionId, currentModel, chatMutation, setSessionGenerating],
  )

  return {
    messages: messages ?? [],
    sendMessage,
  }
}
