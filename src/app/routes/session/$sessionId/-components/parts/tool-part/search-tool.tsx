import type { ToolPart as ToolPartType } from "@/server/sdk/gen/types.gen"

interface SearchToolProps {
  part: ToolPartType
}

export function SearchTool({ part }: SearchToolProps) {
  const truncateText = (text: string, maxLength: number = 500) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  const getSearchQuery = () => {
    if (part.state.status === "running" && part.state.title) {
      return part.state.title
    }
    if (part.state.status === "completed" && part.state.title) {
      return part.state.title
    }
    return "Searching..."
  }

  const getSearchResults = () => {
    if (part.state.status === "completed" && part.state.output) {
      return truncateText(part.state.output)
    }
    if (part.state.status === "error" && part.state.error) {
      return truncateText(part.state.error)
    }
    return null
  }

  const searchQuery = getSearchQuery()
  const searchResults = getSearchResults()

  const hasContent = searchResults && searchResults.length > 0
  const isMinimal = !hasContent || searchResults.length < 100

  return (
    <div
      className={`space-y-2 overflow-hidden
        ${isMinimal ? "min-h-20" : "max-h-80 min-h-32"}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-foreground font-mono text-sm font-medium">
          Searching
        </span>
        <span className="text-muted-foreground truncate text-sm">
          {searchQuery}
        </span>
      </div>

      <div className="bg-chart-3/20 overflow-hidden rounded p-4 text-xs">
        {searchResults && (
          <div className="text-foreground font-mono whitespace-pre-wrap">
            {searchResults}
          </div>
        )}
      </div>
    </div>
  )
}
