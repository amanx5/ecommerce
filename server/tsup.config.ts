import { defineConfig } from "tsup";
import { isServerless } from "./src/utils/environment";

export default defineConfig({
  entry: isServerless() ? ["src/serverless.ts"] : ["src/server.ts"],
  outDir: "dist",
  format: ["esm"],
  platform: "node",
  target: "node22",
  clean: true,
  minify: false,
});
