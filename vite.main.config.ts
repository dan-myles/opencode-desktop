import type { ConfigEnv, UserConfig } from "vite"
import { defineConfig, mergeConfig } from "vite"
import viteTsconfigPaths from "vite-tsconfig-paths"

import {
  external,
  getBuildConfig,
  getBuildDefine,
  pluginHotRestart,
} from "./vite.base.config"

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<"build">
  const { forgeConfigSelf } = forgeEnv
  const define = getBuildDefine(forgeEnv)
  const config: UserConfig = {
    build: {
      lib: {
        entry: forgeConfigSelf.entry,
        fileName: () => "[name].js",
        formats: ["es"],
      },
      rollupOptions: {
        external,
      },
    },
    plugins: [pluginHotRestart("restart"), viteTsconfigPaths()],
    define,
    resolve: {
      // Load the Node.js entry.
      mainFields: ["module", "jsnext:main", "jsnext"],
    },
  }

  return mergeConfig(getBuildConfig(forgeEnv), config)
})
