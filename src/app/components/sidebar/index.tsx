import { Home, Settings, Terminal, TestTube } from "lucide-react"
import { Link } from "@tanstack/react-router"

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
import { Button } from "../ui/button"
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
    <Sidebar variant="inset" collapsible="icon" className="h-full">
      <SidebarHeader>
        {/* Logo section with top padding for titlebar */}
        <div className="flex items-center justify-center gap-2 px-2 py-3 pt-10">
          <div className="flex items-center gap-2">
            <Terminal className="size-6" />
            <span className="font-semibold group-data-[collapsible=icon]:hidden">
              OPENCODE
            </span>
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
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="group-data-[collapsible=icon]:hidden"
          >
            <Link to="/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
          <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
