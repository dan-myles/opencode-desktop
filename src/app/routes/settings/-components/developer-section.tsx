import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Code2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { api } from "@/app/lib/api"
import { startSchema } from "@/server/routers/opencode/types"

export function DeveloperSection() {
  const queryClient = useQueryClient()
  const binary = useQuery(api.opencode.path.queryOptions())
  const status = useQuery(api.opencode.status.queryOptions())

  const form = useForm({
    resolver: zodResolver(startSchema),
    defaultValues: {
      host: "localhost",
      port: 3000,
    },
  })

  const startServer = useMutation(
    api.opencode.start.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(api.opencode.status.queryFilter())
        if (data.success) {
          toast.success(data.message)
        } else {
          toast.error(data.message)
        }
      },
    }),
  )

  const stopServer = useMutation(
    api.opencode.stop.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(api.opencode.status.queryFilter())
        if (data.success) {
          toast.success(data.message)
        } else {
          toast.error(data.message)
        }
      },
    }),
  )

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <Code2 className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Developer Area</h2>
        <Badge variant="secondary" className="text-xs">
          Advanced
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>OpenCode Server</CardTitle>
          <CardDescription>
            Manage the opencode development server and binary information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Binary Information */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Binary Information</h3>
            <div className="space-y-2 text-sm">
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
            </div>
          </div>

          {/* Server Status */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Server Status</h3>
            <div className="space-y-2 text-sm">
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
                      http://{form.watch("host")}:{form.watch("port")}
                    </CodeBox>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Server Controls */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Server Controls</h3>
            <Form {...form}>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Host</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="localhost"
                          disabled={status?.data?.isRunning}
                          className="text-sm"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Port</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="3000"
                          disabled={status?.data?.isRunning}
                          className="text-sm"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </Form>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  const values = form.getValues()
                  startServer.mutate(values)
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
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
