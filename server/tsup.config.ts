import path from "node:path";
import { defineConfig, type Options } from "tsup";
import { isServerless } from "./src/utils/environment";

const API_DIR = path.resolve(import.meta.dirname, "../api");

const COMMONS: Options = {
  format: ["esm"],
  platform: "node",
  target: "node22",
  clean: true,
  minify: false,
};

const useServer = !isServerless();

export default defineConfig({
  entry: useServer ? ["src/server.ts"] : ["src/serverless.ts"],
  outDir: useServer ? "dist" : API_DIR,
  ...COMMONS,
});
