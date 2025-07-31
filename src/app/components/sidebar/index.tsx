import { Link } from "@tanstack/react-router"
import { Home, Settings, Terminal, TestTube } from "lucide-react"

import { Button } from "../ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
} from "../ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { MenuButton } from "./menu-button"

const navigation = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Test",
    url: "/test",
    icon: TestTube,
  },
]

export function AppSidebar() {
  return (
    <>
      <Sidebar variant="sidebar" collapsible="offcanvas" className="h-full">
        <SidebarHeader>
          {/* Logo section with top padding for titlebar */}
          <div
            className="flex items-center justify-center gap-2 px-2 py-3 pt-10"
          >
            <div className="flex items-center gap-2">
              <Terminal className="size-6" />
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
                <span>Settings</span>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarTrigger />
              </TooltipTrigger>
              <TooltipContent side="right">
                <div className="flex items-center gap-2">
                  <span>Toggle Sidebar</span>
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>S
                  </kbd>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
