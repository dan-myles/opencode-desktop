import { useQuery } from "@tanstack/react-query"
import { Folder, Hash } from "lucide-react"

import type { AssistantMessage, Message } from "@/server/sdk/gen/types.gen"
import { Badge } from "@/app/components/ui/badge"
import { api } from "@/app/lib/api"

interface SessionHeaderProps {
  sessionId: string
}

export function SessionHeader({ sessionId }: SessionHeaderProps) {
  const { data: session } = useQuery(
    api.session.get.queryOptions({ id: sessionId }),
  )
  const { data: messages } = useQuery(
    api.session.messages.queryOptions({ id: sessionId }),
  )

  const assistantMessages = messages?.filter(isAssistantMessage) || []

  const latestAssistantMessage = assistantMessages.at(-1)

  const totalTokens = assistantMessages.reduce((total, msg) => {
    if (hasTokens(msg.info)) {
      return (
        total +
        msg.info.tokens.input +
        msg.info.tokens.output +
        msg.info.tokens.reasoning
      )
    }
    return total
  }, 0)

  const cwd =
    latestAssistantMessage && hasPath(latestAssistantMessage.info)
      ? latestAssistantMessage.info.path.cwd
      : undefined

  const contextPercentage = Math.round((totalTokens / 200000) * 100)

  const formatTokens = (tokens: number) => {
    if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(1)}K`
    }
    return tokens.toString()
  }

  if (!session) return null

  return (
    <div
      className="pointer-events-none absolute top-0 right-0 left-0 z-20 flex
        justify-center p-3"
    >
      <div className="pointer-events-auto w-full max-w-3xl">
        <div
          className="bg-background/20 border-border/20 rounded-lg border
            shadow-lg backdrop-blur-md"
        >
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex min-w-0 flex-col">
                <h1 className="truncate text-sm font-medium">
                  {session.title}
                </h1>
                {cwd && (
                  <div
                    className="text-muted-foreground flex items-center gap-1
                      text-xs"
                  >
                    <Folder className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{cwd}</span>
                  </div>
                )}
              </div>
            </div>
            <Badge
              variant="secondary"
              className="ml-3 flex items-center gap-1 text-xs"
            >
              <Hash className="h-3 w-3" />
              {formatTokens(totalTokens)}/{contextPercentage}%
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

function isAssistantMessage(message: { info: Message }): boolean {
  return message.info.role === "assistant"
}

function hasTokens(
  message: Message,
): message is Message & { tokens: AssistantMessage["tokens"] } {
  return "tokens" in message && message.tokens !== undefined
}

function hasPath(
  message: Message,
): message is Message & { path: AssistantMessage["path"] } {
  return "path" in message && message.path !== undefined
}
