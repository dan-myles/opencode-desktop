import { Link, useLocation } from "@tanstack/react-router"
import { Home, TestTube, Settings, Terminal } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip"

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
  const location = useLocation()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const renderMenuButton = (item: typeof navigation[0]) => {
    const button = (
      <SidebarMenuButton
        asChild
        isActive={location.pathname === item.url}
        size="sm"
      >
        <Link 
          to={item.url} 
          viewTransition
          className={`flex items-center gap-2 ${isCollapsed ? 'justify-center w-full' : ''}`}
        >
          <item.icon className="size-6" />
          {!isCollapsed && <span className="text-base">{item.title}</span>}
        </Link>
      </SidebarMenuButton>
    )

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent side="right">
            {item.title}
          </TooltipContent>
        </Tooltip>
      )
    }

    return button
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        {/* Titlebar area with window controls space */}
        <div className="titlebar bg-sidebar sticky top-0 z-50 flex h-8 items-stretch select-none draggable">
          {/* Reserve space for macOS traffic lights on the left */}
          <div className="w-20 flex-shrink-0" />
        </div>
        
        {/* Logo section below titlebar */}
        <div className={`flex items-center gap-2 px-2 py-3 ${isCollapsed ? 'justify-center' : 'justify-center'}`}>
          <Terminal className="size-6" />
          {!isCollapsed && <span className="font-medium text-base">Opencode</span>}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel>Navigation</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {renderMenuButton(item)}
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
              {renderMenuButton(item)}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}