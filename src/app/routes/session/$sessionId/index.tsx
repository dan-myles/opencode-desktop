import { createFileRoute } from "@tanstack/react-router"

import { SessionPage } from "./-components/session-page"

export const Route = createFileRoute("/session/$sessionId/")({
  component: RouteComponent,
  loader: async ({ context: { api, queryClient }, params }) => {
    queryClient.prefetchQuery(
      api.session.messages.queryOptions({ id: params.sessionId }),
    )
    queryClient.prefetchQuery(
      api.session.get.queryOptions({ id: params.sessionId }),
    )
  },
})

function RouteComponent() {
  const { sessionId } = Route.useParams()

  return <SessionPage sessionId={sessionId} />
}
