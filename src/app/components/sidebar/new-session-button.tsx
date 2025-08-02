import { useNavigate } from "@tanstack/react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { api } from "@/app/lib/api"
import type { Session } from "@/server/routers/session/types"

export function NewSessionButton() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const createSession = useMutation(
    api.session.create.mutationOptions({
      onSuccess: (session: Session) => {
        queryClient.invalidateQueries(api.session.list.queryOptions())
        navigate({ to: "/session/$sessionId", params: { sessionId: session.id } })
      },
    })
  )

  const handleCreateSession = () => {
    createSession.mutate()
  }

  return (
    <Button
      onClick={handleCreateSession}
      disabled={createSession.isPending}
      className="w-full justify-start gap-2"
      variant="outline"
    >
      <Plus className="h-4 w-4" />
      {createSession.isPending ? "Creating..." : "New Session"}
    </Button>
  )
}
