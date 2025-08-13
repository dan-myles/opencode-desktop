import { ChevronDown } from "lucide-react"

import { Button } from "@/app/components/ui/button"
import { Shorcut } from "@/app/components/shortcut"
import { cn } from "@/app/lib/utils"

interface ScrollToBottomButtonProps {
  onClick: () => void
  visible: boolean
  className?: string
}

export function ScrollToBottomButton({
  onClick,
  visible,
  className,
}: ScrollToBottomButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn(
        "absolute bottom-36 left-1/2 -translate-x-1/2 z-10 h-auto px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg hover:bg-background/90 transition-all duration-200 flex items-center gap-2",
        visible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
        className,
      )}
    >
      <ChevronDown className="h-4 w-4" />
      <Shorcut label="Scroll to bottom" kbd="L" />
    </Button>
  )
}