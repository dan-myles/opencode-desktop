import { useEffect, useState } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"
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

  const { data: latestEvent } = useSubscription(
    api.session.sessionEvents.subscriptionOptions({ id: sessionId }),
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

  return {
    messages,
    latestEvent,
  }
}
