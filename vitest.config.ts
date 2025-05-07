import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const srcPath = fileURLToPath(new URL("./dist/src", import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./setupTests.js"],
  },
  resolve: {
    alias: {
      "#assets": path.join(srcPath, "assets"),
      "#scalars": path.join(srcPath, "scalars"),
      "#ui": path.join(srcPath, "ui"),
    },
  },
});
