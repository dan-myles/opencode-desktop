import { initTRPC, TRPCError } from "@trpc/server"
import { ZodError } from "zod"

import { createOpencodeClient } from "@/server/sdk"
import { getServerProcessInfo } from "./routers/binary/server"

/**
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async () => {
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

/**
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  isServer: true,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router

/**
 * Middleware for logging function executions and how long they take
 */
const logMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now()
  const result = await next()

  const end = Date.now()
  console.log(`[IPC] ${path} took ${end - start}ms to execute`)

  return result
})

/**
 * Public (unauthenticated) procedure
 */
export const publicProcedure = t.procedure.use(logMiddleware)

/**
 * Server procedure that ensures the opencode server is running
 *
 * This procedure checks that the opencode server is available before executing.
 * Use this for all procedures that need to communicate with the opencode CLI.
 */
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
