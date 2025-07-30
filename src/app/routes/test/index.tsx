import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"

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

export const Route = createFileRoute("/test/")({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
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

  const [port, setPort] = useState(3000)
  const [host, setHost] = useState("localhost")

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Opencode Server Control</h1>
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back home
        </Link>
      </div>

      {/* Binary Information */}
      <Card>
        <CardHeader>
          <CardTitle>Binary Information</CardTitle>
          <CardDescription>
            Information about the opencode binary
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Path:</Label>
            <CodeBox>{binary.data?.path}</CodeBox>
          </div>
          <div className="flex items-center gap-2">
            <Label>Status:</Label>
            <Badge variant={binary.data?.exists ? "default" : "destructive"}>
              {binary.data?.exists ? "Found" : "Not Found"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Label>Environment:</Label>
            <Badge variant="outline">
              {binary.data?.isDev ? "Development" : "Production"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Server Status */}
      <Card>
        <CardHeader>
          <CardTitle>Server Status</CardTitle>
          <CardDescription>
            Current status of the opencode server
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Status:</Label>
            <Badge variant={status.data?.isRunning ? "default" : "secondary"}>
              {status.data?.isRunning ? "Running" : "Stopped"}
            </Badge>
          </div>
          {status.data?.isRunning && (
            <>
              <div className="flex items-center gap-2">
                <Label>PID:</Label>
                <CodeBox>{status.data?.pid}</CodeBox>
              </div>
              <div className="flex items-center gap-2">
                <Label>URL:</Label>
                <CodeBox>
                  http://{host}:{port}
                </CodeBox>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Server Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Server Controls</CardTitle>
          <CardDescription>Start and stop the opencode server</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="localhost"
              />
            </div>
            <div>
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
                placeholder="3000"
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
              className="flex-1"
            >
              {startServer.isPending ? "Starting..." : "Start Server"}
            </Button>
            <Button
              onClick={() => {
                stopServer.mutate()
              }}
              disabled={!status.data?.isRunning || stopServer.isPending}
              variant="destructive"
              className="flex-1"
            >
              {stopServer.isPending ? "Stopping..." : "Stop Server"}
            </Button>
          </div>

          {/* Display mutation results */}
          {startServer.data && (
            <div
              className={`rounded p-3 ${
                startServer.data.success
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {startServer.data.message}
              {startServer.data.url && (
                <div className="mt-1">
                  Server URL: <CodeBox>{startServer.data.url}</CodeBox>
                </div>
              )}
            </div>
          )}

          {stopServer.data && (
            <div
              className={`rounded p-3 ${
                stopServer.data.success
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {stopServer.data.message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
