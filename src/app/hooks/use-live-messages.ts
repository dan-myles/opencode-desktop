import { useCallback, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"

import { api } from "@/app/lib/api"
import { useCurrentSessionMessagesStore } from "@/app/stores/current-session-messages.store"
import { useModeStore } from "@/app/stores/mode.store"
import { useModelStore } from "@/app/stores/model.store"
import { useSessionStateStore } from "@/app/stores/session-state.store"

export function useLiveMessages(sessionId: string) {
  const { messages, setCurrentSession } = useCurrentSessionMessagesStore()
  const currentModel = useModelStore((state) => state.currentModel)
  const currentMode = useModeStore((state) => state.currentMode)
  const { setSessionGenerating } = useSessionStateStore()
  const chatMutation = useMutation(api.session.chat.mutationOptions())
  const messageArray = Array.from(messages.values())

  // Switch session when sessionId changes
  useEffect(() => {
    setCurrentSession(sessionId)
  }, [sessionId, setCurrentSession])

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
          mode: currentMode || undefined,
          parts: [{ type: "text" as const, text }],
        })
      } catch (error) {
        console.error("Failed to send message:", error)
        throw error
      }
    },
    [sessionId, currentModel, currentMode, chatMutation, setSessionGenerating],
  )

  return {
    messages: messageArray,
    sendMessage,
  }
}
