import { useNavigate } from "@tanstack/react-router"
import { Plus } from "lucide-react"

import { Button } from "@/app/components/ui/button"

export function NewSessionButton() {
  const navigate = useNavigate()

  const handleNewSession = () => {
    navigate({ to: "/" })
  }

  return (
    <Button
      onClick={handleNewSession}
      className="w-full justify-start gap-2"
      variant="outline"
    >
      <Plus className="h-4 w-4" />
      New Session
    </Button>
  )
}
