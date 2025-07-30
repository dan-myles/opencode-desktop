import { createFileRoute } from "@tanstack/react-router"

import { Button } from "@/app/components/ui/button"
import { useSidebar } from "@/app/components/ui/sidebar"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  const { setOpen, open } = useSidebar()
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <div className="mt-4">
        <Button
          onClick={() => {
            setOpen(!open)
          }}
        ></Button>
      </div>
    </div>
  )
}
