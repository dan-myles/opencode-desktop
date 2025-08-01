import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Code2 } from "lucide-react"

import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { CodeBox } from "@/app/components/ui/code-box"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { api } from "@/app/lib/api"

export function DeveloperSection() {
  const queryClient = useQueryClient()
  const [port, setPort] = useState(3000)
  const [host, setHost] = useState("localhost")
  const binary = useQuery(api.opencode.path.queryOptions())
  const status = useQuery(api.opencode.status.queryOptions())

  const startServer = useMutation(
    api.opencode.start.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(api.opencode.status.queryFilter())
      },
    }),
  )

  const stopServer = useMutation(
    api.opencode.stop.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(api.opencode.status.queryFilter())
      },
    }),
  )

  return (
    <section
      className="border-accent/50 bg-accent/20 rounded-lg border-2 border-dashed
        p-4"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Code2 className="text-accent-foreground h-4 w-4" />
          <h2 className="text-accent-foreground text-lg font-semibold">
            Developer Area
          </h2>
          <Badge variant="secondary" className="text-xs">
            Advanced
          </Badge>
        </div>

        {/* Binary Information */}
        <Card className="bg-background/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Binary Information</CardTitle>
            <CardDescription className="text-sm">
              Information about the opencode binary
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Label className="text-xs">Status:</Label>
              <Badge
                variant={binary.data?.exists ? "default" : "destructive"}
                className="text-xs"
              >
                {binary.data?.exists ? "Found" : "Not Found"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs">Path:</Label>
              <CodeBox className="text-xs">{binary.data?.path}</CodeBox>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs">Environment:</Label>
              <Badge variant="outline" className="text-xs">
                {binary.data?.isDev ? "Development" : "Production"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Server Status */}
        <Card className="bg-background/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Server Status</CardTitle>
            <CardDescription className="text-sm">
              Current status of the opencode server
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Label className="text-xs">Status:</Label>
              <Badge
                variant={status.data?.isRunning ? "default" : "secondary"}
                className="text-xs"
              >
                {status.data?.isRunning ? "Running" : "Stopped"}
              </Badge>
            </div>
            {status.data?.isRunning && (
              <>
                <div className="flex items-center gap-2">
                  <Label className="text-xs">PID:</Label>
                  <CodeBox className="text-xs">{status.data?.pid}</CodeBox>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs">URL:</Label>
                  <CodeBox className="text-xs">
                    http://{host}:{port}
                  </CodeBox>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Server Controls */}
        <Card className="bg-background/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Server Controls</CardTitle>
            <CardDescription className="text-sm">
              Start and stop the opencode server
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="host" className="mb-2 text-xs">
                  Host
                </Label>
                <Input
                  id="host"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="localhost"
                  disabled={status?.data?.isRunning}
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="port" className="mb-2 text-xs">
                  Port
                </Label>
                <Input
                  id="port"
                  type="number"
                  value={port}
                  onChange={(e) => setPort(Number(e.target.value))}
                  placeholder="3000"
                  disabled={status?.data?.isRunning}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  startServer.mutate({ host, port })
                }}
                disabled={
                  status.data?.isRunning ||
                  startServer.isPending ||
                  !binary.data?.exists
                }
                className="flex-1 text-sm"
                size="sm"
              >
                {startServer.isPending ? "Starting..." : "Start Server"}
              </Button>
              <Button
                onClick={() => {
                  stopServer.mutate()
                }}
                disabled={!status.data?.isRunning || stopServer.isPending}
                variant="destructive"
                className="flex-1 text-sm"
                size="sm"
              >
                {stopServer.isPending ? "Stopping..." : "Stop Server"}
              </Button>
            </div>

            {/* Display mutation results */}
            {startServer.data && (
              <div
                className={`rounded p-3 text-sm ${
                  startServer.data.success
                    ? `bg-primary/10 text-primary-foreground border-primary/20
                      border`
                    : `bg-destructive/10 text-destructive-foreground
                      border-destructive/20 border`
                }`}
              >
                {startServer.data.message}
                {startServer.data.url && (
                  <div className="mt-1">
                    Server URL:{" "}
                    <CodeBox className="text-xs">
                      {startServer.data.url}
                    </CodeBox>
                  </div>
                )}
              </div>
            )}

            {stopServer.data && (
              <div
                className={`rounded p-3 text-sm ${
                  stopServer.data.success
                    ? `bg-primary/10 text-primary-foreground border-primary/20
                      border`
                    : `bg-destructive/10 text-destructive-foreground
                      border-destructive/20 border`
                }`}
              >
                {stopServer.data.message}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

