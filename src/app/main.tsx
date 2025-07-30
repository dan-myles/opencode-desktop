import { StrictMode } from "react"
import { RouterProvider } from "@tanstack/react-router"
import ReactDOM from "react-dom/client"

import { createRouter } from "./router"

import "@/app/styles/globals.css"

const router = createRouter()

const rootElement = document.getElementById("root") as HTMLDivElement
const root = ReactDOM.createRoot(rootElement)
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
