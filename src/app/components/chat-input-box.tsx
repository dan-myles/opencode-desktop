import { useEffect, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Send } from "lucide-react"

import { api } from "@/app/lib/api"
import { cn } from "@/app/lib/utils"
import { useKeybindStore } from "@/app/stores/keybind.store"
import { useModelStore } from "@/app/stores/model.store"
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
          <div className="p-6">
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

      <ModelIndicatorBubble />
    </div>
  )
}

function ModelIndicatorBubble() {
  const currentModel = useModelStore((state) => state.currentModel)
  const { data: providersData } = useQuery(api.config.providers.queryOptions())
  const callbacks = useKeybindStore((state) => state.callbacks)
  const toggleModelMenuCallback = callbacks.get("toggle-model-menu")

  const getModelInfo = () => {
    if (!providersData) return null

    let model = currentModel
    if (!model && providersData.default) {
      const firstProvider = Object.keys(providersData.default)[0]
      if (firstProvider) {
        model = {
          providerID: firstProvider,
          modelID: providersData.default[firstProvider],
        }
      }
    }

    if (!model) return null

    const provider = providersData.providers.find(
      (p) => p.id === model.providerID,
    )
    const modelData = provider?.models[model.modelID]

    return {
      providerName: provider?.name || model.providerID,
      modelName: modelData?.name || model.modelID,
    }
  }

  const handleClick = () => {
    toggleModelMenuCallback?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClick()
    }
  }

  const modelInfo = getModelInfo()

  if (!modelInfo) return null

  return (
    <div className="pointer-events-auto absolute top-full right-4 -mt-3">
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="bg-background/80 border-border hover:border-ring
          hover:ring-ring/50 active:border-ring active:ring-ring/70
          focus-visible:border-ring focus-visible:ring-ring/50 cursor-pointer
          rounded-full border px-3 py-1.5 shadow-lg backdrop-blur-md
          transition-[color,box-shadow] outline-none hover:ring-[3px]
          focus-visible:ring-[3px] active:ring-[3px]"
        role="button"
        tabIndex={0}
        title="Click to change model (Cmd+L)"
      >
        <span className="text-xs">
          <span className="text-muted-foreground">
            {modelInfo.providerName}
          </span>{" "}
          <span className="text-foreground">{modelInfo.modelName}</span>
        </span>
      </div>
    </div>
  )
}
