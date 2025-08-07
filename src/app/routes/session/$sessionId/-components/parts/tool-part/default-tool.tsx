import type { ToolPart as ToolPartType } from "@/server/sdk/gen/types.gen"

interface DefaultToolProps {
  part: ToolPartType
}

export function DefaultTool({ part }: DefaultToolProps) {
  const truncateText = (text: string, maxLength: number = 500) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  const getPreviewContent = () => {
    if (part.state.status === "running" && part.state.title) {
      return part.state.title
    }

    if (part.state.status === "completed") {
      if (part.state.output) {
        return truncateText(part.state.output)
      }
      if (part.state.title) {
        return part.state.title
      }
      if (part.state.input && Object.keys(part.state.input).length > 0) {
        const inputPreview = JSON.stringify(part.state.input, null, 2)
        return truncateText(inputPreview)
      }
    }

    if (part.state.status === "error") {
      if (part.state.error) {
        return truncateText(part.state.error)
      }
      if (part.state.input && Object.keys(part.state.input).length > 0) {
        const inputPreview = JSON.stringify(part.state.input, null, 2)
        return truncateText(inputPreview)
      }
    }

    if (part.state.status === "running" && part.state.input) {
      const inputPreview = JSON.stringify(part.state.input, null, 2)
      return truncateText(inputPreview)
    }

    return null
  }

  const previewContent = getPreviewContent()

  const hasContent = previewContent && previewContent.length > 0
  const isMinimal = !hasContent || previewContent.length < 100

  return (
    <div
      className={`space-y-2 overflow-hidden
        ${isMinimal ? "min-h-20" : "max-h-80 min-h-32"}`}
    >
      <div className="flex items-center gap-2">
        <span
          className="font-mono text-sm font-medium text-slate-900
            dark:text-slate-100"
        >
          {part.tool}
        </span>
      </div>

      {previewContent && (
        <div className="bg-muted overflow-hidden rounded p-4 font-mono text-xs">
          <div className="whitespace-pre-wrap">{previewContent}</div>
        </div>
      )}
    </div>
  )
}
