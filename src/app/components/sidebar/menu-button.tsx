import { Link, useLocation } from "@tanstack/react-router"
import { LucideIcon } from "lucide-react"
import {
  SidebarMenuButton,
} from "@/app/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip"

interface MenuButtonProps {
  title: string
  url: string
  icon: LucideIcon
}

export function MenuButton({ title, url, icon: Icon }: MenuButtonProps) {
  const location = useLocation()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <SidebarMenuButton
          asChild
          isActive={location.pathname === url}
          size="sm"
        >
          <Link 
            to={url} 
            viewTransition
            className="flex items-center gap-3"
          >
            <Icon className="size-4" />
            <span className="group-data-[collapsible=icon]:hidden">{title}</span>
          </Link>
        </SidebarMenuButton>
      </TooltipTrigger>
      <TooltipContent side="right" className="group-data-[collapsible=icon]:block hidden">
        {title}
      </TooltipContent>
    </Tooltip>
  )
}