import { Link } from "@tanstack/react-router"
import { Settings } from "lucide-react"

import { Shorcut } from "@/app/components/shortcut"
import { Button } from "@/app/components/ui/button"
import { SidebarFooter, SidebarTrigger } from "@/app/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip"

export function Footer() {
  return (
    <SidebarFooter>
      <div
        className="flex items-center justify-between px-2
          group-data-[collapsible=icon]:justify-center"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <Shorcut label="Settings" kbd="," />
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger />
          </TooltipTrigger>
          <TooltipContent side="right">
            <Shorcut label="Toggle Sidebar" kbd="S" />
          </TooltipContent>
        </Tooltip>
      </div>
    </SidebarFooter>
  )
}
