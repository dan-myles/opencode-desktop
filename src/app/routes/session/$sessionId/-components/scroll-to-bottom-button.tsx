import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

import { Shorcut } from "@/app/components/shortcut"
import { Button } from "@/app/components/ui/button"
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
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            duration: 0.2,
          }}
          className="absolute bottom-36 left-1/2 z-10 -translate-x-1/2"
        >
          <Button
            variant="outline"
            onClick={onClick}
            className={cn(
              `bg-background/80 hover:bg-background/90 flex h-auto items-center
              gap-2 rounded-full border px-4 py-2 shadow-lg backdrop-blur-sm`,
              className,
            )}
          >
            <ChevronDown className="h-4 w-4" />
            <Shorcut label="Scroll to bottom" kbd="L" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
