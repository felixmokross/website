import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3000,
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [!isVitest() && reactRouter(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
  },
});

function isVitest() {
  return !!process.env.VITEST;
}
