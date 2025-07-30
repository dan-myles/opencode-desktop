import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"
import { api } from "../../lib/api"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { CodeBox } from "../../components/ui/code-box"

export const Route = createFileRoute("/test/")({
  component: RouteComponent,
  loader: ({ context }) => {
    // Test that we can access the query client from context
    console.log("Query client available in loader:", !!context.queryClient)
    console.log("tRPC client available in loader:", !!context.trpcClient)
    return null
  },
})

function RouteComponent() {
  const [port, setPort] = useState(3000)
  const [host, setHost] = useState("localhost")

  // Queries
  const { data: binaryInfo } = api.opencode.getBinaryPath.useQuery()
  const { data: serverStatus, refetch: refetchStatus } = api.opencode.getServerStatus.useQuery()

  // Mutations
  const startServerMutation = api.opencode.startServer.useMutation({
    onSuccess: () => {
      refetchStatus()
    }
  })
  
  const stopServerMutation = api.opencode.stopServer.useMutation({
    onSuccess: () => {
      refetchStatus()
    }
  })

  const handleStartServer = () => {
    startServerMutation.mutate({ port, host })
  }

  const handleStopServer = () => {
    stopServerMutation.mutate()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
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
          <CardDescription>Information about the opencode binary</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Path:</Label>
            <CodeBox>
              {binaryInfo?.path || "Loading..."}
            </CodeBox>
          </div>
          <div className="flex items-center gap-2">
            <Label>Status:</Label>
            <Badge variant={binaryInfo?.exists ? "default" : "destructive"}>
              {binaryInfo?.exists ? "Found" : "Not Found"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Label>Environment:</Label>
            <Badge variant="outline">
              {binaryInfo?.isDev ? "Development" : "Production"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Server Status */}
      <Card>
        <CardHeader>
          <CardTitle>Server Status</CardTitle>
          <CardDescription>Current status of the opencode server</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Status:</Label>
            <Badge variant={serverStatus?.isRunning ? "default" : "secondary"}>
              {serverStatus?.isRunning ? "Running" : "Stopped"}
            </Badge>
          </div>
          {serverStatus?.isRunning && (
            <>
              <div className="flex items-center gap-2">
                <Label>PID:</Label>
                <CodeBox>
                  {serverStatus.pid}
                </CodeBox>
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
              onClick={handleStartServer}
              disabled={serverStatus?.isRunning || startServerMutation.isPending || !binaryInfo?.exists}
              className="flex-1"
            >
              {startServerMutation.isPending ? "Starting..." : "Start Server"}
            </Button>
            <Button
              onClick={handleStopServer}
              disabled={!serverStatus?.isRunning || stopServerMutation.isPending}
              variant="destructive"
              className="flex-1"
            >
              {stopServerMutation.isPending ? "Stopping..." : "Stop Server"}
            </Button>
          </div>

          {/* Display mutation results */}
          {startServerMutation.data && (
            <div className={`p-3 rounded ${startServerMutation.data.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {startServerMutation.data.message}
              {startServerMutation.data.url && (
                <div className="mt-1">
                  Server URL: <CodeBox>{startServerMutation.data.url}</CodeBox>
                </div>
              )}
            </div>
          )}

          {stopServerMutation.data && (
            <div className={`p-3 rounded ${stopServerMutation.data.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {stopServerMutation.data.message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
