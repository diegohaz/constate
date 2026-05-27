import { defineConfig } from "rolldown";
import { dts } from "rolldown-plugin-dts";
import packageJson from "./package.json" with { type: "json" };

export default defineConfig({
  input: "src/index.tsx",
  external: Object.keys(packageJson.peerDependencies ?? {}),
  platform: "neutral",
  output: {
    cleanDir: true,
    format: "es",
    sourcemap: true,
  },
  plugins: [dts()],
});
