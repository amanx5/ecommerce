// Bare import so Vercel's Express entrypoint detection recognizes this file:
// it greps the `app`/`index`/`server` candidates for an `express` import
// (see `entrypointCallback` in vercel/vercel `packages/express/src/build.ts`)
// and rejects files without one. Natively resolvable, so it never breaks
// module linking.
import "express";

// Fail fast when the experimental backend build mode is off: without it,
// Vercel transpiles per-file, so `@/` aliases (and extensionless imports)
// survive into the output and Node crashes at *link* time with
// `ERR_MODULE_NOT_FOUND` — before any module code runs. Hence the dynamic
// import below: it keeps this module's static graph natively resolvable, so
// this error (not the cryptic one) is what surfaces.
// See https://vercel.com/changelog/experimental-build-mode-hono-express
if (process.env.VERCEL_EXPERIMENTAL_BACKENDS !== "1") {
  throw new Error("VERCEL_EXPERIMENTAL_BACKENDS is not set.");
}

// Dynamic import (not static): a static `@/...` import would fail at link
// time, before the guard above ever runs.
const { init } = await import("./init.js");

// Vercel Express entry
// (https://vercel.com/docs/frameworks/backend/express): the default-exported
// app is served as a single function. This module-level init runs once per
// container and is reused by warm invocations.
const { app, db } = await init();

// Retained (never closed) so the DB connection pool stays open across warm
// invocations instead of being garbage-collected.
void db;

export default app;
