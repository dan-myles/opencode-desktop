import type { PatchPart as PatchPartType } from "@/server/sdk/gen/types.gen"

interface PatchPartProps {
  part: PatchPartType
}

export function PatchPart({ part }: PatchPartProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-foreground font-mono text-sm font-medium">
          Patch
        </span>
        <span className="text-muted-foreground text-sm">
          {part.files.length} file{part.files.length !== 1 ? "s" : ""} modified
        </span>
      </div>

      <div className="bg-card rounded p-4">
        <div className="text-sm">
          <div className="mb-2 font-medium">Modified files:</div>
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
