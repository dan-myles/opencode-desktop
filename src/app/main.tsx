import { StrictMode } from "react"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import { QueryClient } from "@tanstack/react-query"
import ReactDOM from "react-dom/client"
import superjson from "superjson"
import { ipcLink } from "trpc-electron/renderer"

import { routeTree } from "./routeTree.gen"
import { api } from "./lib/api"

import "@/app/styles/globals.css"

// Create query client and tRPC client
const queryClient = new QueryClient()
const trpcClient = api.createClient({
  links: [ipcLink({ transformer: superjson })],
})

// Create router with context
const router = createRouter({ 
  routeTree,
  context: {
    queryClient,
    trpcClient,
  }
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById("root") as HTMLDivElement
const root = ReactDOM.createRoot(rootElement)
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
