import { motion } from "motion/react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip"
import { SidebarTrigger, useSidebar } from "./ui/sidebar"
import { Shorcut } from "./shortcut"

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
        <Shorcut label="Toggle Sidebar" kbd="S" />
      </TooltipContent>
    </Tooltip>
  )
}
