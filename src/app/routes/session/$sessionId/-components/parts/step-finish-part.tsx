import type { StepFinishPart as StepFinishPartType } from "@/server/sdk/gen/types.gen"

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
      <div className="text-muted-foreground">
        <span>Reasoning step completed</span>
      </div>

      <div className="text-muted-foreground space-x-2 text-xs">
        <span>
          {formatTokens(part.tokens.input + part.tokens.output)} tokens
        </span>
        {part.cost > 0 && <span>{formatCost(part.cost)}</span>}
      </div>
    </div>
  )
}
