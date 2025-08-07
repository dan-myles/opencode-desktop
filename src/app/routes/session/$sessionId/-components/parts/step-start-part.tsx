import type { StepStartPart as StepStartPartType } from "@/server/sdk/gen/types.gen"

interface StepStartPartProps {
  part: StepStartPartType
}

export function StepStartPart({ part: _part }: StepStartPartProps) {
  return (
    <div className="text-muted-foreground text-sm">
      <span>Starting reasoning step...</span>
    </div>
  )
}
