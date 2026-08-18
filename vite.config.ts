import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@netlify/vite-plugin-tanstack-start";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart({
      // Custom SSR entry with error-page wrapping (src/server.ts)
      server: { entry: "src/server.ts" },
    }),
    netlify(),
    viteReact(),
    tailwindcss(),
  ],
});
