import { PlayIcon } from "lucide-react"

import type { StepStartPart as StepStartPartType } from "@/server/sdk/gen/types.gen"

interface StepStartPartProps {
  part: StepStartPartType
}

export function StepStartPart({ part: _part }: StepStartPartProps) {
  return (
    <div className="text-muted-foreground flex items-center gap-2 text-sm">
      <PlayIcon className="h-4 w-4 text-blue-500" />
      <span>Starting reasoning step...</span>
    </div>
  )
}
