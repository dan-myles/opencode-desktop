import { Home, TestTube, Settings, Terminal } from "lucide-react"
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

const bottomNavigation = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon" className="h-full">
      <SidebarHeader>
        {/* Logo section with top padding for titlebar */}
        <div className="flex items-center justify-between gap-2 px-2 py-3 pt-10">
          <div className="flex items-center gap-2">
            <Terminal className="size-6" />
            <span className="font-semibold group-data-[collapsible=icon]:hidden">Opencode</span>
          </div>
          <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
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
        <SidebarMenu>
          {bottomNavigation.map((item) => (
            <SidebarMenuItem key={item.title}>
              <MenuButton 
                title={item.title}
                url={item.url}
                icon={item.icon}
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}