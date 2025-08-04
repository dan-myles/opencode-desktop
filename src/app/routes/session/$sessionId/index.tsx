import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Send } from "lucide-react"

import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { api } from "@/app/lib/api"
import { useModelStore } from "@/app/stores/model.store"
import { SessionHeader } from "./-components/session-header"
import { VirtualizedChatMessages } from "./-components/virtualized-chat-messages"

export const Route = createFileRoute("/session/$sessionId/")({
  component: SessionPage,
  loader: async ({ context: { api, queryClient }, params }) => {
    queryClient.prefetchQuery(
      api.session.messages.queryOptions({ id: params.sessionId }),
    )
    queryClient.prefetchQuery(
      api.session.get.queryOptions({ id: params.sessionId }),
    )
  },
})

function SessionPage() {
  const { sessionId } = Route.useParams()
  const selectedModel = useModelStore((state) => state.currentModel)
  const { data: session } = useSuspenseQuery(
    api.session.messages.queryOptions({ id: sessionId }),
  )
  const { data: providersData } = useQuery(api.config.providers.queryOptions())

  // Get the model to display (selected or default)
  const displayModel =
    selectedModel ||
    (providersData
      ? {
          providerID: Object.keys(providersData.default)[0],
          modelID: Object.values(providersData.default)[0],
        }
      : null)

  // Get the pretty name for the model with brand
  const getModelDisplayContent = () => {
    if (!displayModel || !providersData) return null

    const provider = providersData.providers.find(
      (p) => p.id === displayModel.providerID,
    )
    if (!provider) {
      return (
        <span className="text-xs">
          {displayModel.providerID}/{displayModel.modelID}
        </span>
      )
    }

    const model = provider.models[displayModel.modelID]
    if (!model) {
      return (
        <span className="text-xs">
          {displayModel.providerID}/{displayModel.modelID}
        </span>
      )
    }

    return (
      <span className="text-xs">
        <span className="text-muted-foreground">{provider.name}</span>{" "}
        <span className="text-foreground">{model.name}</span>
      </span>
    )
  }

  return (
    <div className="relative h-full max-w-full">
      {/* Floating header */}
      <SessionHeader sessionId={sessionId} />

      {/* Chat messages background */}
      <div className="absolute inset-20 inset-x-0">
        <VirtualizedChatMessages messages={session || []} />
      </div>

      {/* Floating bottom-docked chatbox */}
      <div
        className="pointer-events-none absolute right-0 bottom-0 left-0 flex
          justify-center p-6 pb-10"
      >
        <div className="pointer-events-auto relative w-full max-w-2xl">
          {/* Backdrop blur container */}
          <div
            className="bg-background/80 relative rounded-xl border shadow-2xl
              backdrop-blur-md"
          >
            {/* Chat input area */}
            <div className="p-6">
              <div className="flex gap-3">
                <Input
                  placeholder="Type your message..."
                  className="bg-background border-border flex-1"
                />
                <Button size="icon" className="bg-primary hover:bg-primary/90">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Floating model indicator */}
          {displayModel && (
            <div className="pointer-events-auto absolute top-full right-4 -mt-3">
              <div
                className="bg-background/80 border-border rounded-full border
                  px-3 py-1.5 shadow-lg backdrop-blur-md"
              >
                {getModelDisplayContent()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
