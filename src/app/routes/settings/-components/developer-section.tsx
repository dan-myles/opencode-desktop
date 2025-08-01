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
import { startSchema } from "@/server/routers/binary/types"

export function DeveloperSection() {
  const queryClient = useQueryClient()
  const binary = useQuery(api.binary.path.queryOptions())
  const status = useQuery(api.binary.status.queryOptions())

  const defaultValues = startSchema.parse({})

  const form = useForm({
    resolver: zodResolver(startSchema),
    defaultValues,
  })

  const startServer = useMutation(
    api.binary.start.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(api.binary.status.queryFilter())
        toast.success(data.message)
      },
      onError: (data) => {
        toast.error(data.message)
      },
    }),
  )

  const stopServer = useMutation(
    api.binary.stop.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(api.binary.status.queryFilter())
        toast.success(data.message)
      },
      onError: (data) => {
        toast.error(data.message)
      },
    }),
  )

  return (
    <section
      className="border-accent-foreground/20 bg-accent/20 space-y-6 rounded-lg
        border-2 border-dashed p-6"
    >
      <div className="flex items-center gap-2">
        <Code2 className="text-accent-foreground h-5 w-5" />
        <h2 className="text-accent-foreground text-xl font-semibold">
          Developer Area
        </h2>
        <Badge variant="secondary" className="text-xs">
          Advanced
        </Badge>
      </div>

      {/* Binary Information Card */}
      <Card className="bg-background/10">
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

      {/* Server Status Card */}
      <Card className="bg-background/10">
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

      {/* Server Controls Card */}
      <Card className="bg-background/10">
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
                        placeholder={defaultValues.host}
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
                        placeholder={defaultValues.port.toString()}
                        disabled={status?.data?.isRunning}
                        className="text-sm"
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
    </section>
  )
}
