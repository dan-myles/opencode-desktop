import { Terminal } from "lucide-react"

import { NewSessionButton } from "./new-session-button"

export function Header() {
  return (
    <div
      className="bg-sidebar border-sidebar-border/50 sticky top-0 z-10 -mx-2
        rounded-b-lg border-b p-4"
      style={{
        WebkitTransform: "translate3d(0,0,0)",
        transform: "translate3d(0,0,0)",
      }}
    >
      <div
        className="flex items-center justify-center gap-2 px-2 py-3 pt-10 pb-4"
      >
        <div className="flex items-center gap-2">
          <Terminal className="size-6" />
          <span>OPENCODE</span>
        </div>
      </div>

      <NewSessionButton className="mt-4" />
    </div>
  )
}
