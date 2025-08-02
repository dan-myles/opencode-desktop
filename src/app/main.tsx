import { StrictMode } from "react"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import ReactDOM from "react-dom/client"

import { api } from "./lib/api"
import { getQueryClient } from "./lib/query-client"
import { routeTree } from "./routeTree.gen"

import "@/app/styles/globals.css"

const router = createRouter({
  routeTree,
  scrollRestoration: true,
  defaultPreload: "intent",
  context: {
    api,
    queryClient: getQueryClient(),
  },
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
