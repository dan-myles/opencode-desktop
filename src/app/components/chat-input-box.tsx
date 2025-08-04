import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Send } from "lucide-react"

import { api } from "@/app/lib/api"
import { cn } from "@/app/lib/utils"
import { useModelStore } from "@/app/stores/model.store"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface ChatInputBoxProps {
  className?: string
  onSend?: (message: string) => void
  placeholder?: string
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void
}

function ModelIndicatorBubble() {
  const currentModel = useModelStore((state) => state.currentModel)
  const { data: providersData } = useQuery(api.config.providers.queryOptions())

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

  const modelInfo = getModelInfo()

  if (!modelInfo) return null

  return (
    <div className="pointer-events-auto absolute top-full right-4 -mt-3">
      <div
        className="bg-background/80 border-border rounded-full border px-3
          py-1.5 shadow-lg backdrop-blur-md"
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

export function ChatInputBox({
  className,
  onSend,
  placeholder = "Type your message...",
  disabled = false,
  value,
  onChange,
}: ChatInputBoxProps) {
  const [internalValue, setInternalValue] = useState("")

  const inputValue = value !== undefined ? value : internalValue
  const handleChange = onChange || setInternalValue

  const handleSend = () => {
    if (!inputValue.trim() || disabled) return
    onSend?.(inputValue.trim())
    if (value === undefined) {
      setInternalValue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className="bg-background/80 relative rounded-xl border shadow-2xl
          backdrop-blur-md"
      >
        <div className="p-6">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="bg-background/50 border-border/50 flex-1
                backdrop-blur-sm"
              disabled={disabled}
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || disabled}
              size="icon"
              className="bg-primary/90 hover:bg-primary"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <ModelIndicatorBubble />
    </div>
  )
}
