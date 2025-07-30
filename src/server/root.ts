import { opencodeRouter } from "./routers/opencode/opencode.router"
import { createTRPCRouter } from "./trpc"

/**
 * This is the primary router for your server.
 */
export const appRouter = createTRPCRouter({
  opencode: opencodeRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
