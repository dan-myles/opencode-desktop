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
                    http://{form.watch("host")}:{form.watch("port")}
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
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
