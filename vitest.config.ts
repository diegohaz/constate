import { defaultExclude, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    watch: false,
    globals: true,
    environment: "jsdom",
    include: ["**/*.test.{ts,tsx}"],
    exclude: [...defaultExclude, "**/.tsc"],
  },
});
