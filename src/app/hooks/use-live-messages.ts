import { useCallback, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

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
        toast.error("No model selected. Please select a model first.")
        throw new Error("No model selected. Please select a model first.")
      }

      // Create optimistic message with temporary ID
      const optimisticMessageId = `temp-${Date.now()}-${Math.random()}`
      const optimisticPartId = `temp-part-${Date.now()}-${Math.random()}`

      const optimisticMessage = {
        info: {
          id: optimisticMessageId,
          sessionID: sessionId,
          role: "user" as const,
          time: { created: Date.now() },
        },
        parts: [
          {
            id: optimisticPartId,
            sessionID: sessionId,
            messageID: optimisticMessageId,
            type: "text" as const,
            text,
            synthetic: true,
          },
        ],
      }

      // Add optimistically using existing addMessage
      const { addMessage } = useCurrentSessionMessagesStore.getState()
      addMessage(optimisticMessage)

      try {
        setSessionGenerating(sessionId)

        await chatMutation.mutateAsync({
          id: sessionId,
          providerID: currentModel.providerID,
          modelID: currentModel.modelID,
          agent: currentMode || undefined,
          parts: [{ type: "text" as const, text }],
        })
      } catch (error) {
        // Remove optimistic message on error
        useCurrentSessionMessagesStore.setState((prev) => {
          const newMessages = new Map(prev.messages)
          newMessages.delete(optimisticMessageId)
          return { messages: newMessages }
        })
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
