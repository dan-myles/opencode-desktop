import { Clock, Play, Square } from "lucide-react"

import type { Part } from "@/server/routers/session/types"
import { Badge } from "@/app/components/ui/badge"

interface StepPartProps {
  part: Part & {
    step?: string
    cost?: number
    tokens?: {
      input: number
      output: number
      reasoning: number
    }
  }
  isUser: boolean
}

export function StepPart({ part, isUser }: StepPartProps) {
  const isStart = part.type === "step-start"
  const isFinish = part.type === "step-finish"
  const step = String(part.step || "Processing")

  const formatTokens = (tokens?: {
    input: number
    output: number
    reasoning: number
  }) => {
    if (!tokens) return ""
    const total = tokens.input + tokens.output + tokens.reasoning
    return `${total.toLocaleString()} tokens`
  }

  const formatCost = (cost?: number) => {
    if (!cost) return ""
    return `$${cost.toFixed(4)}`
  }

  if (isUser) {
    // User steps: Simple display within blue bubble
    return (
      <div className="text-sm text-blue-200">
        {isStart ? "▶️" : isFinish ? "⏹️" : "⏳"} {step}
      </div>
    )
  }

  // Assistant steps: Inline display using theme colors
  return (
    <div
      className="bg-primary/10 border-primary/20 flex items-center gap-3
        rounded-lg border px-3 py-2"
    >
      <div className="flex-shrink-0">
        {isStart && <Play className="text-primary h-4 w-4" />}
        {isFinish && <Square className="text-accent-foreground h-4 w-4" />}
        {!isStart && !isFinish && (
          <Clock className="text-muted-foreground h-4 w-4" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-foreground text-sm font-medium">{step}</div>
        {isFinish && (part.tokens || part.cost) && (
          <div className="mt-1 flex items-center gap-2">
            {part.tokens && (
              <Badge variant="outline" className="text-xs">
                {formatTokens(part.tokens)}
              </Badge>
            )}
            {part.cost && (
              <Badge variant="outline" className="text-xs">
                {formatCost(part.cost)}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
