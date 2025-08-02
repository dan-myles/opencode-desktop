import { Image as ImageIcon } from "lucide-react"

import type { Part } from "@/server/routers/session/types"

interface ImagePartProps {
  part: Part & {
    url?: string
    filename?: string
    alt?: string
  }
  isUser: boolean
}

export function ImagePart({ part, isUser }: ImagePartProps) {
  const url = part.url
  const filename = String(part.filename || "Image")
  const alt = String(part.alt || filename)

  if (!url) {
    return (
      <div
        className={`flex items-center gap-2 rounded-lg p-3 ${
          isUser ? "text-blue-200" : "bg-muted border-border border"
        }`}
      >
        <ImageIcon
          className={`h-5 w-5
            ${isUser ? "text-blue-200" : "text-muted-foreground"}`}
        />
        <span className="text-sm">Image not available</span>
      </div>
    )
  }

  if (isUser) {
    // User images: Simple display within blue bubble
    return (
      <div className="overflow-hidden rounded">
        <img
          src={url}
          alt={alt}
          className="h-auto max-w-full rounded"
          style={{ maxHeight: "200px" }}
        />
        {filename && (
          <div className="mt-1 text-xs text-blue-200">{filename}</div>
        )}
      </div>
    )
  }

  // Assistant images: Clean, borderless display
  return (
    <div className="overflow-hidden rounded-lg">
      <img
        src={url}
        alt={alt}
        className="h-auto max-w-full"
        style={{ maxHeight: "400px" }}
      />
      {filename && (
        <div className="text-muted-foreground bg-muted p-2 text-xs">
          {filename}
        </div>
      )}
    </div>
  )
}
