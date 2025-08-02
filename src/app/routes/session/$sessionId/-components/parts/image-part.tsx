import { Image as ImageIcon } from "lucide-react"

import type { Part } from "@/server/routers/session/types"

interface ImagePartProps {
  part: Part & {
    url?: string
    filename?: string
    alt?: string
  }
}

export function ImagePart({ part }: ImagePartProps) {
  const url = part.url
  const filename = String(part.filename || "Image")
  const alt = String(part.alt || filename)

  if (!url) {
    return (
      <div className="bg-muted/30 flex items-center gap-2 rounded-lg border p-4">
        <ImageIcon className="text-muted-foreground h-5 w-5" />
        <span className="text-muted-foreground text-sm">
          Image not available
        </span>
      </div>
    )
  }

  return (
    <div className="bg-muted/30 overflow-hidden rounded-lg border">
      <img
        src={url}
        alt={alt}
        className="h-auto max-w-full"
        style={{ maxHeight: "400px" }}
      />
      {filename && (
        <div className="text-muted-foreground border-t p-2 text-xs">
          {filename}
        </div>
      )}
    </div>
  )
}
