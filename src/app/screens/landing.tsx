import { Github, Sparkles, Zap } from "lucide-react"

import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { ModeToggle } from "../components/mode-toggle"

export function LandingScreen() {
  return (
    <div
      className="h-full bg-gradient-to-br from-slate-900 via-blue-900
        to-slate-900"
    >
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div
          className="container mx-auto flex items-center justify-between px-4
            py-4"
        >
          <div className="flex items-center space-x-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg
                bg-gradient-to-r from-blue-500 to-blue-600"
            >
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Reactronite</span>
          </div>
          <ModeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20
            to-blue-600/20 blur-3xl"
        />
        <div className="relative container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge
              className="mb-6 border-blue-500/20 bg-blue-500/10 text-blue-400"
            >
              <Sparkles className="mr-1 h-3 w-3" />
              Modern Electron Development
            </Badge>
            <h1
              className="mb-6 text-5xl leading-tight font-bold text-white
                lg:text-7xl"
            >
              Build Desktop Apps with
              <span
                className="bg-gradient-to-r from-blue-400 to-blue-400
                  bg-clip-text text-transparent"
              >
                {" "}
                Lightning Speed
              </span>
            </h1>
            <p
              className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed
                text-gray-300"
            >
              The ultimate Electron-Forge boilerplate with React, Vite, and
              TypeScript. Get your desktop application up and running in
              minutes, not hours.
            </p>
            <div
              className="flex flex-col items-center justify-center gap-4
                sm:flex-row"
            >
              <Button
                size="lg"
                className="bg-black/20 font-semibold text-white shadow-lg
                  transition-colors hover:bg-black/10"
                onClick={() => {
                  window.open(
                    "https://github.com/flaviodelgrosso/reactronite",
                    "_blank",
                  )
                }}
              >
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
