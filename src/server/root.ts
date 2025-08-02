import { appRouter as opencodeAppRouter } from "./routers/app/app.router"
import { binaryRouter } from "./routers/binary/binary.router"
import { configRouter } from "./routers/config/config.router"
import { eventRouter } from "./routers/event/event.router"
import { fileRouter } from "./routers/file/file.router"
import { findRouter } from "./routers/find/find.router"
import { sessionRouter } from "./routers/session/session.router"
import { tuiRouter } from "./routers/tui/tui.router"
import { createTRPCRouter } from "./trpc"

/**
 * This is the primary router for your server.
 */
export const appRouter = createTRPCRouter({
  binary: binaryRouter,
  app: opencodeAppRouter,
  session: sessionRouter,
  config: configRouter,
  find: findRouter,
  file: fileRouter,
  tui: tuiRouter,
  event: eventRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
