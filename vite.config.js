import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// BASE_PATH=/kariyer/ builds the site for a sub-path: kayra.technology/kariyer proxies to this deployment.
// The output then goes to dist/kariyer/ so the deployment serves the same path. Default: "/" and dist/.
const base = process.env.BASE_PATH || "/";
const outDir = base === "/" ? "dist" : `dist${base.replace(/\/$/, "")}`;

export default defineConfig({
  base,
  plugins: [react()],
  server: { host: "127.0.0.1", port: 5174, strictPort: true },
  preview: { host: "127.0.0.1", port: 4174, strictPort: true },
  build: {
    outDir,
    rolldownOptions: {
      onwarn(warning, warn) {
        // lucide-react ships "use client" directives; they are meaningless in a client-only SPA.
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
    },
  },
  test: {
    include: ["tests/unit/**/*.test.js"],
    environment: "node",
  },
});
