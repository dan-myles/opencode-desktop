import { useEffect, useRef, useState } from "react"
import { Send } from "lucide-react"

import { cn } from "@/app/lib/utils"
import { ModeIndicator } from "./mode-indicator"
import { ModelIndicator } from "./model-indicator"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface ChatInputBoxProps {
  sessionId: string
  onSendMessage: (text: string) => Promise<void>
  placeholder?: string
  autoFocus?: boolean
  className?: string
}

export function ChatInputBox({
  sessionId,
  onSendMessage,
  placeholder = "Type your message...",
  autoFocus = false,
  className,
}: ChatInputBoxProps) {
  const [message, setMessage] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus, sessionId])

  const isValid = () => message.trim().length > 0

  const handleSend = async () => {
    if (!isValid()) return

    const messageText = message.trim()
    setMessage("") // Clear input immediately

    try {
      await onSendMessage(messageText)
    } catch (error) {
      console.error("Failed to send message:", error)
      // Restore message on error
      setMessage(messageText)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void handleSend()
  }

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit}>
        <div
          className="bg-background/80 relative rounded-xl border shadow-2xl
            backdrop-blur-md"
        >
          <div className="p-8">
            <div className="flex gap-3">
              <Input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="bg-background/50 border-border/50 flex-1
                  backdrop-blur-sm"
              />
              <Button
                type="submit"
                disabled={!isValid()}
                size="icon"
                className="bg-primary/90 hover:bg-primary"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </form>

      <ModelIndicator />
      <ModeIndicator />
    </div>
  )
}
