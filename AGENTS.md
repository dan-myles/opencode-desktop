# Opencode Desktop Project

Opencode Desktop is an Electron application that provides a desktop interface for managing and interacting with the opencode CLI tool.
It's built with modern web technologies and provides a native desktop experience.

## Tech Stack

- **Framework**: Electron with Vite
- **Frontend**: React 19 with TypeScript
- **Routing**: TanStack Router
- **API Layer**: tRPC for type-safe client-server communication
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier

## Project Structure

```
src/
├── app/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   └── providers/     # React context providers
│   ├── routes/            # TanStack Router pages
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and API client
│   └── styles/            # Global CSS styles
├── server/                # tRPC server (runs in main process)
│   └── routers/           # tRPC route definitions
├── types/                 # TypeScript type definitions
├── main.ts               # Electron main process
├── preload.ts            # Electron preload script
└── window.ts             # Window management utilities

bin/                      # Opencode CLI binary location
```

## Key Concepts

### Electron Architecture

- **Main Process**: Node.js environment (`src/main.ts`)
- **Renderer Process**: Web environment (React app in `src/app/`)
- **Preload Script**: Bridge between main and renderer (`src/preload.ts`)

### tRPC Integration

- Server runs in the main process (`src/server/`)
- Client communicates via IPC (`src/app/lib/api.ts`)
- Type-safe API calls throughout the application

## Standards

- Prefer single-word variable/function names
- Avoid unnecessary `try/catch` blocks
- Minimize `else` statements
- Use early returns over nested conditionals
- Inline functionality unless truly reusable
- When importing code, only use relative imports if we are in the same directory, else use @/
- Functional components with hooks
- Use TypeScript for all components
- Follow existing component patterns in `src/app/components/`
- Use Tailwind CSS classes
- Follow shadcn/ui component patterns
- Maintain consistent spacing and typography
- Avoid `try {} catch() {}` where possible, prefer to let exceptions bubble up
- Avoid `else` statements where possible
- Do not make useless helper functions, inline functionality unless the function is reusable or composable
- Prefer early returns over nested `if` statements
- Use conventional commits such as feat(scope): <desc> or fix: <desc>
- When using conventional commits try to always use a scope when possible
- Write short and simple PR summaries, they should be to the point and easy to read
- When pushing a large commit write a commit summary after the conventional commit message, after \n
- DON'T show git diffs, sometimes they are too large!
- DO NOT make functions like `renderSomeItem` make them react components instead
- We are using SHADCN, which is our component library in `@/app/components/ui`, use these ALL THE TIME
- When making other styles, ALWAYS use our theme variables in `@/app/styles/globals.css`
- Try not to leave comments, only do so if they are very necessary!
- NEVER USE ANY, NEVER USE IT EVER, we should always try to find correct types
- ALWAYS check lint errors with `pnpm lint` before finishing a task
- NEVER make functions like `renderSomething()` always use REACT COMPONENTS instead

1. **Always run type checking** after code changes: `pnpm typecheck`, do this over starting the development server
2. **Follow existing patterns** - check similar components/functions before creating new ones
3. **Use tRPC for all main↔renderer communication** - avoid direct IPC
4. **Respect the Electron security model** - use preload scripts appropriately
5. **Test in both development and packaged modes** when working with binary paths
6. **Check `bin/opencode` exists** before testing server functionality

## Common Tasks

### Adding New Routes

1. Create component in `src/app/routes/`
2. Use `createFileRoute` from TanStack Router
3. Routes auto-generate in `routeTree.gen.ts`

### Adding tRPC Procedures

1. Add procedures to `src/server/routers/`
2. Export from `src/server/root.ts`
3. Use in React with `api.routerName.procedureName.useQuery/useMutation`
