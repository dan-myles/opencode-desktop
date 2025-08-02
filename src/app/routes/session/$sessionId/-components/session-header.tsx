// TODO: Fix ESLint warnings & errors
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { useSuspenseQuery } from "@tanstack/react-query"
import { Folder, Hash } from "lucide-react"

import { Badge } from "@/app/components/ui/badge"
import { api } from "@/app/lib/api"

interface SessionHeaderProps {
  sessionId: string
}

export function SessionHeader({ sessionId }: SessionHeaderProps) {
  const { data: session } = useSuspenseQuery(
    api.session.get.queryOptions({ id: sessionId }),
  )
  const { data: messages } = useSuspenseQuery(
    api.session.messages.queryOptions({ id: sessionId }),
  )

  const latestAssistantMessage = messages
    ?.filter((msg) => msg.info.role === "assistant")
    ?.at(-1)

  const totalTokens =
    messages
      ?.filter((msg) => msg.info.role === "assistant")
      ?.reduce((total, msg) => {
        const tokens = (msg.info as any).tokens
        if (!tokens) return total
        return total + tokens.input + tokens.output + tokens.reasoning
      }, 0) || 0

  const cwd = (latestAssistantMessage?.info as any)?.path?.cwd

  // Estimate context percentage (assuming ~200k token context window)
  const contextPercentage = Math.round((totalTokens / 200000) * 100)

  // Format token count (e.g., 31.7K)
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
