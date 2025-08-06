import { GitBranchIcon } from "lucide-react"

import type { PatchPart as PatchPartType } from "@/server/sdk/gen/types.gen"
import { Badge } from "@/app/components/ui/badge"

interface PatchPartProps {
  part: PatchPartType
}

export function PatchPart({ part }: PatchPartProps) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <GitBranchIcon className="h-4 w-4 text-orange-500" />
        <span className="text-sm font-medium">Code Changes</span>
        <Badge variant="outline" className="text-xs">
          {part.files.length} file{part.files.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="space-y-1">
        <div className="text-muted-foreground font-mono text-xs">
          Hash: {part.hash}
        </div>

        <div className="text-sm">
          <div className="mb-1 font-medium">Modified files:</div>
          <div className="space-y-1">
            {part.files.map((file, index) => (
              <div
                key={index}
                className="bg-muted rounded px-2 py-1 font-mono text-xs"
              >
                {file}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
