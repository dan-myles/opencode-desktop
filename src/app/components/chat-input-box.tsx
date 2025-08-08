import { useEffect, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { Send } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { api } from "@/app/lib/api"
import { cn } from "@/app/lib/utils"
import { useKeybindStore } from "@/app/stores/keybind.store"
import { useModelStore } from "@/app/stores/model.store"
import { Button } from "./ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { Input } from "./ui/input"

const messageSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(10000, "Message too long")
    .trim(),
})

interface ChatInputBoxProps {
  className?: string
  placeholder?: string
  sessionId?: string
  onSessionCreated?: (sessionId: string) => void
  disabled?: boolean
  autoFocus?: boolean
}

export function ChatInputBox({
  className,
  placeholder = "Type your message...",
  sessionId,
  onSessionCreated,
  disabled = false,
  autoFocus = false,
}: ChatInputBoxProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const currentModel = useModelStore((state) => state.currentModel)
  const { data: providersData } = useQuery(api.config.providers.queryOptions())
  const inputRef = useRef<HTMLInputElement>(null)

  const form = useForm<{ message: string }>({
    resolver: zodResolver(messageSchema),
    defaultValues: { message: "" },
  })

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const getDefaultModel = () => {
    if (currentModel) return currentModel
    if (providersData?.default) {
      const firstProvider = Object.keys(providersData.default)[0]
      if (firstProvider) {
        return {
          providerID: firstProvider,
          modelID: providersData.default[firstProvider],
        }
      }
    }
    return { providerID: "anthropic", modelID: "claude-3-5-sonnet-20241022" }
  }

  const chatMutation = useMutation({
    ...api.session.chat.mutationOptions(),
    onSuccess: () => {
      // Refetch messages after successful send
      if (sessionId) {
        void queryClient.invalidateQueries({
          queryKey: api.session.messages.queryKey({ id: sessionId }),
        })
      }
    },
  })

  const createSession = useMutation(api.session.create.mutationOptions())

  const onSubmit = async (data: { message: string }) => {
    // Reset form immediately for instant feedback
    const messageText = data.message
    form.reset()

    try {
      let targetSessionId = sessionId

      // Create new session if none provided
      if (!targetSessionId) {
        const session = await createSession.mutateAsync()
        if (!session) throw new Error("Failed to create session")

        targetSessionId = session.id
        queryClient.invalidateQueries(api.session.list.queryOptions())

        // Notify parent component
        onSessionCreated?.(session.id)
      }

      // Send message to session
      const model = getDefaultModel()
      await chatMutation.mutateAsync({
        id: targetSessionId,
        providerID: model.providerID,
        modelID: model.modelID,
        parts: [
          {
            type: "text" as const,
            text: messageText,
          },
        ],
      })

      // Navigate to session if it was newly created and no callback provided
      if (!sessionId && !onSessionCreated) {
        navigate({
          to: "/session/$sessionId",
          params: { sessionId: targetSessionId },
        })
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void form.handleSubmit(onSubmit)()
    }
  }

  // Only disable input during session creation, not during message sending
  const isInputDisabled = createSession.isPending || disabled

  return (
    <div className={cn("relative", className)}>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit(onSubmit)()
          }}
        >
          <div
            className="bg-background/80 relative rounded-xl border shadow-2xl
              backdrop-blur-md"
          >
            <div className="p-6">
              <div className="flex gap-3">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          ref={inputRef}
                          onKeyDown={handleKeyDown}
                          placeholder={placeholder}
                          className="bg-background/50 border-border/50
                            backdrop-blur-sm"
                          disabled={isInputDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isInputDisabled || !form.formState.isValid}
                  size="icon"
                  className="bg-primary/90 hover:bg-primary"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>

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
