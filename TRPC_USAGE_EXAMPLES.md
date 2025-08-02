# tRPC Opencode API Usage Examples

This document shows how to use the newly implemented tRPC routers that proxy the opencode CLI API using context-based client injection.

## Client-side Usage

```typescript
import { api } from "@/app/lib/api"

// App operations
const appInfo = await api.app.get.query()
const modes = await api.app.modes.query()
await api.app.init.mutate()
await api.app.log.mutate({
  service: "desktop",
  level: "info",
  message: "Application started",
})

// Session operations
const sessions = await api.session.list.query()
const newSession = await api.session.create.mutate()

await api.session.init.mutate({
  id: "ses123",
  messageID: "msg456",
  providerID: "anthropic",
  modelID: "claude-3",
})

const chatResponse = await api.session.chat.mutate({
  id: "ses123",
  providerID: "anthropic",
  modelID: "claude-3",
  parts: [{ type: "text", text: "Hello!" }],
})

const messages = await api.session.messages.query({ id: "ses123" })
const message = await api.session.message.query({
  id: "ses123",
  messageID: "msg456",
})

// Config operations
const config = await api.config.get.query()
const providers = await api.config.providers.query()

// Find operations
const textMatches = await api.find.text.query({ pattern: "function" })
const files = await api.find.files.query({ query: "*.ts" })
const symbols = await api.find.symbols.query({ query: "MyClass" })

// File operations
const fileContent = await api.file.read.query({ path: "/path/to/file.ts" })
const fileStatus = await api.file.status.query()

// TUI operations
await api.tui.appendPrompt.mutate({ text: "Hello world" })
await api.tui.openHelp.mutate()
await api.tui.submitPrompt.mutate()

// Event subscription info
const eventInfo = await api.event.subscribe.query()
// Use eventInfo.url with EventSource API for SSE
```

## Architecture

### Context-Based Client Injection

The implementation uses tRPC context to inject the opencode client into every procedure:

```typescript
// Context creation (in trpc.ts)
export async function createTRPCContext() {
  const { isRunning } = getServerProcessInfo()

  const client = isRunning
    ? createOpencodeClient({
        baseUrl: "http://localhost:4096",
      })
    : null

  return {
    client,
    isServerRunning: isRunning,
  }
}

// Server procedure that ensures client availability
export const serverProcedure = publicProcedure.use((opts) => {
  if (!opts.ctx.isServerRunning || !opts.ctx.client) {
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      message: "Opencode server is not running",
    })
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
      client: opts.ctx.client, // Now guaranteed to be non-null
    },
  })
})
```

### Clean Router Implementation

Each router procedure directly uses the injected client:

```typescript
export const appRouter = {
  get: serverProcedure.query(async ({ ctx }) => {
    const response = await ctx.client.app.get()
    return response.data
  }),

  log: serverProcedure.input(logSchema).mutation(async ({ input, ctx }) => {
    const response = await ctx.client.app.log({ body: input })
    return response.data
  }),
}
```

## Router Structure

The API mirrors the OpenAPI operationIds exactly:

- `app.get` → GET `/app`
- `app.init` → POST `/app/init`
- `app.log` → POST `/log`
- `app.modes` → GET `/mode`
- `session.list` → GET `/session`
- `session.create` → POST `/session`
- `session.chat` → POST `/session/{id}/message`
- `config.get` → GET `/config`
- `config.providers` → GET `/config/providers`
- `find.text` → GET `/find?pattern=...`
- `find.files` → GET `/find/file?query=...`
- `find.symbols` → GET `/find/symbol?query=...`
- `file.read` → GET `/file?path=...`
- `file.status` → GET `/file/status`
- `tui.*` → Various TUI operations
- `event.subscribe` → Connection info for SSE

## Benefits

1. **Type Safety**: Full TypeScript support with auto-generated types from OpenAPI
2. **Consistent API**: Same structure as OpenAPI operationIds
3. **Centralized Client Management**: Single client instance managed via context
4. **Automatic Server Checking**: Context creation checks server availability
5. **Clean Procedures**: Router procedures are simple and focused
6. **Generated SDK**: Uses the auto-generated opencode client
7. **Maintainable**: Easy to update when OpenAPI spec changes
8. **Error Handling**: Centralized server availability checking with proper tRPC errors

## Server Availability

All operations using `serverProcedure` automatically check if the opencode server is running and throw a `TRPCError` with code `SERVICE_UNAVAILABLE` if not available. The context is created fresh for each request, ensuring up-to-date server status.
