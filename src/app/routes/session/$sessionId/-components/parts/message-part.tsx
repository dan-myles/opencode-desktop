import type { Message, Part } from "@/server/sdk/gen/types.gen"
import { FilePart } from "./file-part"
import { PatchPart } from "./patch-part"
import { SnapshotPart } from "./snapshot-part"
import { StepFinishPart } from "./step-finish-part"
import { StepStartPart } from "./step-start-part"
import { TextPart } from "./text-part"
import { ToolPart } from "./tool-part"

interface MessagePartProps {
  part: Part
  message: Message
}

export function MessagePart({ part, message }: MessagePartProps) {
  switch (part.type) {
    case "text":
      return <TextPart part={part} message={message} />
    case "file":
      return <FilePart part={part} />
    case "tool":
      return <ToolPart part={part} />
    case "step-start":
      return <StepStartPart part={part} />
    case "step-finish":
      return <StepFinishPart part={part} />
    case "snapshot":
      return <SnapshotPart part={part} />
    case "patch":
      return <PatchPart part={part} />
    default:
      return (
        <div className="text-muted-foreground text-sm">Unknown part type</div>
      )
  }
}
