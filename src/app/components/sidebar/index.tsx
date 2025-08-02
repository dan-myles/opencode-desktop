import { Link } from "@tanstack/react-router"
import { Home, Settings, Terminal } from "lucide-react"

import { Button } from "@/app/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/app/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip"
import { Shorcut } from "../shortcut"
import { MenuButton } from "./menu-button"
import { SessionList } from "./session-list"

const navigation = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
]

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="offcanvas" className="h-full">
      <SidebarHeader>
        {/* Logo section with top padding for titlebar */}
        <div className="flex items-center justify-center gap-2 px-2 py-3 pt-10">
          <div className="flex items-center gap-2">
            <Terminal className="size-6" />
            <span>OPENCODE</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <MenuButton
                    title={item.title}
                    url={item.url}
                    icon={item.icon}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

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
