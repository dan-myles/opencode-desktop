import { Sidebar, SidebarContent } from "@/app/components/ui/sidebar"
import { Footer } from "./footer"
import { Header } from "./header"
import { SessionList } from "./session-list"
import { SessionListPinned } from "./session-list-pinned"

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="offcanvas" className="h-full">
      <SidebarContent className="scrollbar-none relative">
        <Header />
        <SessionListPinned />
        <SessionList />
      </SidebarContent>
      <Footer />
    </Sidebar>
  )
}
