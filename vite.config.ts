import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "./lib/index.ts",
      formats: ["es"],
    },
  },
  server: {
    host: "127.0.0.1",
  },
  plugins: [dts({ tsconfigPath: "./tsconfig.lib.json" })],
});
