import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import prismjs from "vite-plugin-prismjs";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tailwindcss(),
    !isVitest() && reactRouter(),
    tsconfigPaths(),
    prismjs({
      languages: [
        "shell",
        "json",
        "typescript",
        "clike",
        "javascript",
        "css",
        "html",
        "tsx",
        "jsx",
        "yaml",
        "diff",
        "markdown",
      ],
      plugins: ["diff-highlight"],
    }),
  ],
  test: {
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
  },
});

function isVitest() {
  return !!process.env.VITEST;
}
