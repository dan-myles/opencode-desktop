import { CheckIcon } from "lucide-react"

import type { StepFinishPart as StepFinishPartType } from "@/server/sdk/gen/types.gen"
import { Badge } from "@/app/components/ui/badge"

interface StepFinishPartProps {
  part: StepFinishPartType
}

export function StepFinishPart({ part }: StepFinishPartProps) {
  const formatTokens = (tokens: number) => {
    if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(1)}k`
    }
    return tokens.toString()
  }

  const formatCost = (cost: number) => {
    if (cost < 0.01) {
      return `$${(cost * 100).toFixed(2)}¢`
    }
    return `$${cost.toFixed(3)}`
  }

  return (
    <div className="flex items-center justify-between text-sm">
      <div className="text-muted-foreground flex items-center gap-2">
        <CheckIcon className="text-chart-2 h-4 w-4" />
        <span>Reasoning step completed</span>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          {formatTokens(part.tokens.input + part.tokens.output)} tokens
        </Badge>
        {part.cost > 0 && (
          <Badge variant="outline" className="text-xs">
            {formatCost(part.cost)}
          </Badge>
        )}
      </div>
    </div>
  )
}
