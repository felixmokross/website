import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import prismjs from "vite-plugin-prismjs";

export default defineConfig({
  server: {
    port: 3000,
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [
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
