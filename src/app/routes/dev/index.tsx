import { useMutation } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import { Button } from "@/app/components/ui/button"
import { api } from "@/app/lib/api"

export const Route = createFileRoute("/dev/")({
  component: RouteComponent,
})

function RouteComponent() {
  const test = useMutation(api.session.test.mutationOptions())

  return (
    <div className="p-20">
      <Button
        onClick={() => {
          console.log("SENDING MESSAGE")
          test.mutate()
          console.log("SENT MESSAGE")
        }}
      >
        SEND MESSAGE
      </Button>
    </div>
  )
}
