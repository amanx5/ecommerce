// Bare import so Vercel's Express entrypoint detection recognizes this file:
// it greps the `app`/`index`/`server` candidates for an `express` import
// (see `entrypointCallback` in vercel/vercel `packages/express/src/build.ts`)
// and rejects files without one. No runtime effect beyond the import itself.
import "express";
import { init } from "@/init";

// Vercel Express entry
// (https://vercel.com/docs/frameworks/backend/express): the default-exported
// app is served as a single function. This module-level init runs once per
// container and is reused by warm invocations.
const { app, db } = await init();

// Retained (never closed) so the DB connection pool stays open across warm
// invocations instead of being garbage-collected.
void db;

export default app;
