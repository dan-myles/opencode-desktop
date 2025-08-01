import type { ConfigEnv } from "vite"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import svgrPlugin from "vite-plugin-svgr"
import viteTsconfigPaths from "vite-tsconfig-paths"

import { productName, version } from "./package.json"
import { pluginExposeRenderer } from "./vite.base.config"

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<"renderer">
  const { root, mode, forgeConfigSelf } = forgeEnv
  const name = forgeConfigSelf.name ?? ""

  return {
    root,
    mode,
    base: "./",
    build: {
      outDir: `.vite/renderer/${name}`,
    },
    resolve: {
      preserveSymlinks: true,
    },
    clearScreen: false,
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
      }),
      react({
        babel: {
          plugins: [
            [
              "babel-plugin-react-compiler",
              {
                sources: ["src/app"],
              },
            ],
          ],
        },
      }),
      pluginExposeRenderer(name),
      svgrPlugin(),
      viteTsconfigPaths(),
      tailwindcss(),
    ],
    define: {
      __DARWIN__: process.platform === "darwin",
      __WIN32__: process.platform === "win32",
      __LINUX__: process.platform === "linux",
      __APP_NAME__: JSON.stringify(productName),
      __APP_VERSION__: JSON.stringify(version),
      __DEV__: process.env.NODE_ENV === "development",
    },
  }
})
