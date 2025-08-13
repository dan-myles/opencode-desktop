"use no memo"

import { useEffect, useRef } from "react"

import type { Message, Part } from "@/server/sdk/gen/types.gen"
import { cn } from "@/app/lib/utils"
import { ChatMessage } from "./chat-message"

interface ConversationProps {
  messages: Array<{ info: Message; parts: Part[] }>
}

export function Conversation({ messages }: ConversationProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  // Invert wheel scroll for natural scrolling behavior
  useEffect(() => {
    const el = parentRef.current
    if (!el) return

    const invertedWheelScroll = (event: WheelEvent) => {
      el.scrollTop -= event.deltaY
      event.preventDefault()
    }

    el.addEventListener("wheel", invertedWheelScroll, { passive: false })
    return () => el.removeEventListener("wheel", invertedWheelScroll)
  }, [messages.length])

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center opacity-60">
        <div className="text-muted-foreground py-8 text-center">
          No messages in this session yet. Start a conversation below!
        </div>
      </div>
    )
  }

  return (
    <div
      ref={parentRef}
      className="h-full overflow-y-auto"
      style={{ transform: "scaleY(-1)" }}
    >
      <div className="w-full pt-[7rem] pb-[5.5rem]">
        {messages
          .slice()
          .reverse()
          .map((message) => {
            return (
              <div
                className="w-full px-40"
                key={message.info.id}
                style={{ transform: "scaleY(-1)" }}
              >
                <ChatMessage message={message} />
              </div>
            )
          })}
      </div>
    </div>
  )
}

