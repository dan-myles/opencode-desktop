import { binaryRouter } from "./routers/binary/binary.router"
import { createTRPCRouter } from "./trpc"

/**
 * This is the primary router for your server.
 */
export const appRouter = createTRPCRouter({
  binary: binaryRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
