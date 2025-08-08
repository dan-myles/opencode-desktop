import { Link } from "@tanstack/react-router"
import { Settings, Terminal } from "lucide-react"

import { Button } from "@/app/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarTrigger,
} from "@/app/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip"
import { Shorcut } from "../shortcut"
import { NewSessionButton } from "./new-session-button"
import { SessionList } from "./session-list"

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="offcanvas" className="h-full">
      <SidebarContent className="scrollbar-none relative">
        <div
          className="bg-sidebar border-sidebar-border/50 sticky top-0 z-10 -mx-2
            rounded-b-lg border-b p-4"
          style={{
            WebkitTransform: "translate3d(0,0,0)",
            transform: "translate3d(0,0,0)",
          }}
        >
          <div
            className="flex items-center justify-center gap-2 px-2 py-3 pt-10
              pb-4"
          >
            <div className="flex items-center gap-2">
              <Terminal className="size-6" />
              <span>OPENCODE</span>
            </div>
          </div>

          <NewSessionButton className="mt-4" />
        </div>

        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Sessions</SidebarGroupLabel>
          <SidebarGroupContent className="flex-1">
            <SessionList />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

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
    </Sidebar>
  )
}
