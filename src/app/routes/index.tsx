import { createFileRoute, Link } from "@tanstack/react-router"

import { api } from "@/app/lib/api"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  const { data } = api.opencode.binaryPath.useQuery({ name: "Dan" })

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Link to="/test" viewTransition>
        TO TEST
        {data}
      </Link>
    </div>
  )
}
