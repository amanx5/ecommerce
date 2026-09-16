import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig(
  {
    ignores: ["dist", "node_modules", ".vercel"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Configurations for all types of files
  {
    languageOptions: {
      parserOptions: {
        // Set the root directory for resolving tsconfig.json in a monorepo (required for ESLint extension)
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Configurations for TypeScript files
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
);
