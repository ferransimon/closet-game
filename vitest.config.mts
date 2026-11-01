import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": import.meta.dirname } },
  test: { include: ["__tests__/**/*.test.ts"] },
});
