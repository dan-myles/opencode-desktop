import { useCallback, useEffect, useRef, useState } from "react"

import type { Message, Part } from "@/server/sdk/gen/types.gen"
import { useRegisterKeybind } from "@/app/stores/keybind.store"
import { ChatMessage } from "./chat-message"
import { ScrollToBottomButton } from "./scroll-to-bottom-button"

interface ConversationProps {
  messages: Array<{ info: Message; parts: Part[] }>
}

export function Conversation({ messages }: ConversationProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  const scrollToBottom = useCallback(() => {
    if (parentRef.current) {
      parentRef.current.scrollTop = 0 // Top of inverted container = visual bottom
    }
  }, [])

  useRegisterKeybind({
    id: "scroll-to-bottom",
    keys: {
      darwin: "cmd+l",
      win32: "ctrl+l",
      linux: "ctrl+l",
    },
    description: "Scroll to bottom/latest messages",
    callback: scrollToBottom,
  })

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

  // Track scroll position to show/hide scroll button
  useEffect(() => {
    const el = parentRef.current
    if (!el) return

    const handleScroll = () => {
      const shouldShow = el.scrollTop > 100 // Show when scrolled away from bottom
      setShowScrollButton(shouldShow)
    }

    el.addEventListener("scroll", handleScroll)
    return () => el.removeEventListener("scroll", handleScroll)
  }, [])

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
    <>
      <div
        ref={parentRef}
        className="h-full overflow-y-auto"
        style={{ transform: "scaleY(-1)" }}
      >
        <div className="flex w-full flex-col-reverse pt-[7rem] pb-[5.5rem]">
          {messages.map((message) => (
            <div
              className="w-full px-40"
              key={message.info.id}
              style={{ transform: "scaleY(-1)" }}
            >
              <ChatMessage message={message} />
            </div>
          ))}
        </div>
      </div>

      <ScrollToBottomButton onClick={scrollToBottom} visible={true} />
    </>
  )
}
