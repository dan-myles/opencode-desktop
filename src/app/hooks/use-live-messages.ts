import { useCallback, useEffect, useMemo, useState } from "react"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { useSubscription } from "@trpc/tanstack-react-query"

import type { Message, Part } from "@/server/sdk/gen/types.gen"
import { api } from "@/app/lib/api"

type MessageWithParts = {
  info: Message
  parts: Part[]
}

export function useLiveMessages(sessionId: string) {
  const { data: initialMessages } = useSuspenseQuery(
    api.session.messages.queryOptions({ id: sessionId }),
  )

  const [messages, setMessages] = useState<MessageWithParts[]>(
    () => initialMessages || [],
  )
  const [optimisticMessages, setOptimisticMessages] = useState<
    MessageWithParts[]
  >([])

  const { data: latestEvent } = useSubscription(
    api.session.sessionEvents.subscriptionOptions({ id: sessionId }),
  )

  const chatMutation = useMutation(api.session.chat.mutationOptions())

  // Merge real messages with optimistic ones
  const allMessages = useMemo(() => {
    const messageMap: Record<string, MessageWithParts> = {}

    // Add real messages first
    for (const msg of messages) {
      messageMap[msg.info.id] = msg
    }

    // Add optimistic messages (they'll be replaced when real ones arrive)
    for (const msg of optimisticMessages) {
      if (!messageMap[msg.info.id]) {
        messageMap[msg.info.id] = msg
      }
    }

    return Object.values(messageMap).sort(
      (a, b) => a.info.time.created - b.info.time.created,
    )
  }, [messages, optimisticMessages])

  // Send message function with optimistic update
  const sendMessage = useCallback(
    async (text: string) => {
      const optimisticId = `msg_optimistic_${Date.now()}`
      const now = Math.floor(Date.now() / 1000)

      // Create optimistic message
      const optimisticMessage: MessageWithParts = {
        info: {
          id: optimisticId,
          sessionID: sessionId,
          role: "user",
          time: { created: now },
        } as Message,
        parts: [
          {
            id: `prt_optimistic_${Date.now()}`,
            sessionID: sessionId,
            messageID: optimisticId,
            type: "text",
            text: text,
          } as Part,
        ],
      }

      // Add optimistic message immediately
      setOptimisticMessages((prev) => [...prev, optimisticMessage])

      try {
        // Send actual message
        await chatMutation.mutateAsync({
          id: sessionId,
          providerID: "anthropic",
          modelID: "claude-3-5-sonnet-20241022",
          parts: [{ type: "text" as const, text }],
        })
      } catch (error) {
        // Remove optimistic message on error
        setOptimisticMessages((prev) =>
          prev.filter((msg) => msg.info.id !== optimisticId),
        )
        throw error
      }
    },
    [sessionId, chatMutation],
  )

  useEffect(() => {
    if (!latestEvent) return

    console.log("🔥 New event:", latestEvent.type)

    switch (latestEvent.type) {
      case "message.updated": {
        console.log("📝 Adding/updating message...")

        const newMessage = {
          info: latestEvent.properties.info,
          parts: [],
        }

        setMessages((prev) => {
          const existingIndex = prev.findIndex(
            (m) => m.info.id === newMessage.info.id,
          )

          if (existingIndex >= 0) {
            const updated = [...prev]
            updated[existingIndex] = {
              ...newMessage,
              parts: prev[existingIndex].parts,
            }
            return updated
          } else {
            return [...prev, newMessage]
          }
        })
        break
      }

      case "message.part.updated": {
        console.log("🧩 Adding/updating message part...")

        const part = latestEvent.properties.part

        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.info.id === part.messageID) {
              const filteredParts = msg.parts.filter((p) => p.id !== part.id)
              const updatedParts = [...filteredParts, part]

              const sortedParts = updatedParts.sort((a, b) => {
                if (
                  a.type === "text" &&
                  b.type === "text" &&
                  "time" in a &&
                  "time" in b &&
                  a.time &&
                  b.time
                ) {
                  return a.time.start - b.time.start
                }

                if (a.type === "step-start" && b.type !== "step-start")
                  return -1
                if (b.type === "step-start" && a.type !== "step-start") return 1

                return a.id.localeCompare(b.id)
              })

              console.log(
                `Message ${part.messageID} now has ${sortedParts.length} parts`,
              )

              return {
                ...msg,
                parts: sortedParts,
              }
            }
            return msg
          }),
        )
        break
      }

      case "message.removed": {
        console.log("🗑️ Removing message...")

        setMessages((prev) =>
          prev.filter(
            (msg) => msg.info.id !== latestEvent.properties.messageID,
          ),
        )
        break
      }

      case "message.part.removed": {
        console.log("🗑️ Removing message part...")

        const { messageID, partID } = latestEvent.properties

        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.info.id === messageID) {
              return {
                ...msg,
                parts: msg.parts.filter((p) => p.id !== partID),
              }
            }
            return msg
          }),
        )
        break
      }
    }
  }, [latestEvent])

  // Clean up optimistic messages when real ones arrive
  useEffect(() => {
    if (latestEvent?.type === "message.updated") {
      // Remove optimistic messages when real ones come in
      setOptimisticMessages((prev) =>
        prev.filter((msg) => !msg.info.id.startsWith("msg_optimistic_")),
      )
    }
  }, [latestEvent])

  return {
    messages: allMessages,
    latestEvent,
    sendMessage,
  }
}
