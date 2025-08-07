import { CameraIcon } from "lucide-react"

import type { SnapshotPart as SnapshotPartType } from "@/server/sdk/gen/types.gen"
import { Badge } from "@/app/components/ui/badge"

interface SnapshotPartProps {
  part: SnapshotPartType
}

export function SnapshotPart({ part }: SnapshotPartProps) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <CameraIcon className="text-chart-4 h-4 w-4" />
        <span className="text-foreground text-sm font-medium">
          State Snapshot
        </span>
        <Badge variant="outline" className="text-xs">
          {part.snapshot.length} chars
        </Badge>
      </div>

      <div
        className="bg-muted max-h-40 overflow-y-auto rounded p-2 font-mono
          text-xs whitespace-pre-wrap"
      >
        {part.snapshot}
      </div>
    </div>
  )
}
