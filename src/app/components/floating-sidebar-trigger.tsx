import { motion } from "motion/react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip"
import { SidebarTrigger, useSidebar } from "./ui/sidebar"

export function FloatingSidebarTrigger() {
  const { open } = useSidebar()

  return open ? null : (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-4 left-4"
        >
          <SidebarTrigger className="" />
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="right">
        <div className="flex items-center gap-2">
          <span>Toggle Sidebar</span>
          <kbd
            className="bg-muted text-muted-foreground pointer-events-none
              inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono
              text-[10px] font-medium opacity-100 select-none"
          >
            <span className="text-xs">⌘</span>S
          </kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
