import type { SnapshotPart as SnapshotPartType } from "@/server/sdk/gen/types.gen"

interface SnapshotPartProps {
  part: SnapshotPartType
}

export function SnapshotPart({ part }: SnapshotPartProps) {
  return (
    <div>
      <div className="mb-2">
        <span className="text-foreground text-sm font-medium">
          State Snapshot
        </span>
        <span className="text-muted-foreground ml-2 text-xs">
          {part.snapshot.length} characters
        </span>
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
