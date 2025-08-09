# Opencode Desktop

A modern desktop application for interacting with the opencode CLI tool, built with Electron and React.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Electron](https://img.shields.io/badge/electron-37.0.0-blue.svg)
![React](https://img.shields.io/badge/react-19.1.1-blue.svg)

## Overview

Opencode Desktop provides a native desktop interface for managing and interacting with Opencode sessions.
Built with modern web technologies, it offers a seamless experience for AI-powered coding assistance with features like:

- **Session Management** - Create, manage, and navigate between multiple coding sessions
- **Real-time Chat Interface** - Interactive chat with AI assistance for your coding tasks
- **Modern UI** - Clean, responsive interface built with shadcn/ui components
- **Cross-platform** - Will be available for Windows, Mac, and Linux

## Installation

### Download

> Coming soon!

## Development

### Prerequisites

- Node 18.x
- Pnpm 10.x
- Go 1.24.x
- Bun 1.2.x

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/sst/opencode-desktop.git
   cd opencode-desktop
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

### Project Structure

```
src/
├── app/                    # Frontend React application (Vite SPA w/ Tanstack Router)
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Shadcn/ui components
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

### Updating Opencode SDK

1. Copy over new Opencode binaries
2. Run script to generate SDK `packages/sdk/js/script/generate`
3. Copy over new SDK
4. Add new endpoints to TRPC router

> Note: TRPC router API closely follows generated SDK

### Roadmap

- [x] feat(ui): command menu model selection in sessions
- [x] feat(ui): currently selected model ui
- [x] perf(chat): refactor virtualization & markdown rendering (need more FPS)
- [x] feat(sessions): session pinning for quick access to important conversations
- [x] feat(keybinds): keyboard shortcuts customization and management
- [x] feat(chat): enhanced markdown rendering with better formatting
- [x] feat(chat): message streaming with real-time typing indicators
- [ ] feat(ui): view transition animation for chatbox repositioning on new session start
- [ ] feat(app): auto-updater integration for seamless app updates
- [ ] feat(notifications): native notifications for long-running tasks and responses
- [ ] feat(sessions): session sharing and collaboration features
- [ ] feat(chat): syntax highlighting for code blocks in messages
- [ ] feat(sync): background session sync and conflict resolution
- [ ] feat(keybinds): add scopes to binds for smart disabling (cmd p/n disabled in command menu)
