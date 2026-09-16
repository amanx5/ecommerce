import path from "node:path";

export function getEnvironment() {
  return process.env.NODE_ENV;
}
export function isProduction() {
  return getEnvironment() === "production";
}

export function isDevelopment() {
  return !isProduction();
}

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is missing");
  }

  return secret;
}

export function isServerless() {
  return process.env.VERCEL === "1";
}

/** Returns list of trusted origins (in lowercase) */
export function getTrustedOrigins(): string[] {
  const raw = process.env.TRUSTED_ORIGINS ?? "";

  // Lowercased: URL schemes and hosts are case-insensitive, and browsers
  // always send `Origin` lowercase — so comparisons just work.
  return raw
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, "").toLowerCase())
    .filter((origin) => origin.length > 0);
}

/**
 * Absolute path of the server package root.
 *
 * `npm run dev` and `npm start` both run from the package root, so
 * package-relative resources (`public/`, the default `logs/`, …) resolve
 * from here. Centralized in one helper so that assumption lives in a single
 * place instead of scattered `process.cwd()` calls.
 */
export function getServerRoot(): string {
  return process.cwd();
}

/** Resolves `segments` against the server package root. */
export function resolveFromServerRoot(...segments: string[]): string {
  return path.join(getServerRoot(), ...segments);
}
