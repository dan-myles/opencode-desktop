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
            className="flex items-center justify-center w-full"
          >
            <Icon className="size-6" />
          </Link>
        </SidebarMenuButton>
      </TooltipTrigger>
      <TooltipContent side="right">
        {title}
      </TooltipContent>
    </Tooltip>
  )
}