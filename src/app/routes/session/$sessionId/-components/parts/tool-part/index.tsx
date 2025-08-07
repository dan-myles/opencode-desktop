import type { ToolPart as ToolPartType } from "@/server/sdk/gen/types.gen"
import { BashTool } from "./bash-tool"
import { DefaultTool } from "./default-tool"
import { EditTool } from "./edit-tool"
import { ReadTool } from "./read-tool"
import { SearchTool } from "./search-tool"
import { WriteTool } from "./write-tool"

interface ToolPartProps {
  part: ToolPartType
}

export function ToolPart({ part }: ToolPartProps) {
  switch (part.tool) {
    case "bash":
      return <BashTool part={part} />
    case "read":
      return <ReadTool part={part} />
    case "write":
      return <WriteTool part={part} />
    case "edit":
      return <EditTool part={part} />
    case "grep":
      return <SearchTool part={part} />
    default:
      return <DefaultTool part={part} />
  }
}
