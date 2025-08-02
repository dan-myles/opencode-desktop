import { Link, useLocation } from "@tanstack/react-router"
import { type LucideIcon } from "lucide-react"

import { SidebarMenuButton } from "@/app/components/ui/sidebar"

interface MenuButtonProps {
  title: string
  url: string
  icon: LucideIcon
}

export function MenuButton({ title, url, icon: Icon }: MenuButtonProps) {
  const location = useLocation()

  return (
    <SidebarMenuButton asChild isActive={location.pathname === url} size="sm">
      <Link
        to={url}
        viewTransition
        className="flex items-center gap-3
          group-data-[collapsible=icon]:justify-center"
      >
        <Icon className="size-4" />
        <span className="group-data-[collapsible=icon]:hidden">{title}</span>
      </Link>
    </SidebarMenuButton>
  )
}
