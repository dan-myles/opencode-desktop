// TODO: Find a way to cancel scroll "momentum" when we hit the keybind
// This is primarily to do with trackpad stuff. We have momentum when
// we scroll on a trackpad and its interfering with keyboard usage.
// There should be a way we can swap back and forth between scrolling
// using a trackpad and keyboard and not have little bugs.
// The bug currently is just that scroll momentum persists WHILE
// keybinds are being hit, can't find a way to stop the scroll.

import { useCallback, useEffect, useRef, useState } from "react"
import { animate, useMotionValue } from "framer-motion"

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

  const scrollY = useMotionValue(0)

  const scrollToBottom = useCallback(() => {
    if (parentRef.current) {
      const currentScroll = parentRef.current.scrollTop
      const targetScroll = 0
      const scrollDistance = Math.abs(currentScroll - targetScroll)

      // Calculate duration based on distance
      // Base duration of 0.3s, with additional time based on scroll distance
      const baseDuration = 0.3
      const maxDuration = 1.5
      const scrollHeight = parentRef.current.scrollHeight
      const distanceRatio = scrollDistance / scrollHeight
      const duration = Math.min(baseDuration + distanceRatio * 1.2, maxDuration)

      // Stop any ongoing animations
      scrollY.stop()

      // Set initial value and animate to bottom
      scrollY.set(currentScroll)
      animate(scrollY, 0, {
        duration,
        ease: "easeOut",
        onUpdate: (value) => {
          if (parentRef.current) {
            parentRef.current.scrollTop = value
          }
        },
        onComplete: () => {
          scrollY.stop()
          setShowScrollButton(false)
        },
      })
    }
  }, [scrollY])

  const scrollDown = useCallback(() => {
    if (parentRef.current) {
      const currentScroll = parentRef.current.scrollTop
      const viewportHeight = parentRef.current.clientHeight
      const scrollAmount = viewportHeight * 0.8 // Scroll 80% of viewport height
      const targetScroll = Math.max(0, currentScroll - scrollAmount)

      // Stop any ongoing animations
      scrollY.stop()

      // Set initial value and animate
      scrollY.set(currentScroll)
      animate(scrollY, targetScroll, {
        duration: 0.15,
        ease: "easeInOut",
        onUpdate: (value) => {
          if (parentRef.current) {
            parentRef.current.scrollTop = value
          }
        },
        onComplete: () => {
          scrollY.stop()
          // Update scroll button visibility
          const shouldShow = parentRef.current
            ? parentRef.current.scrollTop > 100
            : false
          setShowScrollButton(shouldShow)
        },
      })
    }
  }, [scrollY])

  const scrollUp = useCallback(() => {
    if (parentRef.current) {
      const currentScroll = parentRef.current.scrollTop
      const viewportHeight = parentRef.current.clientHeight
      const scrollAmount = viewportHeight * 0.8 // Scroll 80% of viewport height
      const maxScroll =
        parentRef.current.scrollHeight - parentRef.current.clientHeight
      const targetScroll = Math.min(maxScroll, currentScroll + scrollAmount)

      // Stop any ongoing animations
      scrollY.stop()

      // Set initial value and animate
      scrollY.set(currentScroll)
      animate(scrollY, targetScroll, {
        duration: 0.15,
        ease: "easeInOut",
        onUpdate: (value) => {
          if (parentRef.current) {
            parentRef.current.scrollTop = value
          }
        },
        onComplete: () => {
          scrollY.stop()
          // Update scroll button visibility
          const shouldShow = parentRef.current
            ? parentRef.current.scrollTop > 100
            : false
          setShowScrollButton(shouldShow)
        },
      })
    }
  }, [scrollY])

  useRegisterKeybind({
    id: "scroll-to-bottom",
    keys: {
      darwin: "cmd+g",
      win32: "ctrl+g",
      linux: "ctrl+g",
    },
    description: "Scroll to bottom/latest messages",
    callback: scrollToBottom,
  })

  useRegisterKeybind({
    id: "scroll-down",
    keys: {
      darwin: "cmd+d",
      win32: "ctrl+d",
      linux: "ctrl+d",
    },
    description: "Scroll down in conversation",
    callback: scrollDown,
  })

  useRegisterKeybind({
    id: "scroll-up",
    keys: {
      darwin: "cmd+u",
      win32: "ctrl+u",
      linux: "ctrl+u",
    },
    description: "Scroll up in conversation",
    callback: scrollUp,
  })

  // Invert wheel scroll for natural scrolling behavior and track scroll position
  // Also show and hide scroll to bottom
  useEffect(() => {
    const el = parentRef.current
    if (!el) return

    const invertedWheelScroll = (event: WheelEvent) => {
      el.scrollTop -= event.deltaY
      event.preventDefault()

      // Track scroll position for button visibility
      const shouldShow = el.scrollTop > 100
      setShowScrollButton(shouldShow)
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

      <ScrollToBottomButton
        onClick={scrollToBottom}
        visible={showScrollButton}
      />
    </>
  )
}
