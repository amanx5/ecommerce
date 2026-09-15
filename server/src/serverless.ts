import { createApp } from "@/application/createApp";
import { Responder } from "@/application/utils";
import { setupPersistence, type PersistenceInstance } from "@/persistance";
import { addAppLog } from "@/utils";
import type { Express, Request, Response } from "express";

type WarmCache = {
  app: Express;
  // Retained (not read per-request) so the DB connection pool stays open
  // across warm invocations instead of being garbage-collected.
  db: PersistenceInstance;
};

let cache: Promise<WarmCache> | null = null;

export default async function handler(req: Request, res: Response) {
  try {
    cache ??= initialize();
    const { app } = await cache;
    return app(req, res);
  } catch (err) {
    await addAppLog("error", "Serverless function failed to initialize.", err);

    if (res.headersSent) return;

    return Responder.error(
      res,
      "Service temporarily unavailable. Please try again.",
      err,
    );
  }
}

async function initialize(): Promise<WarmCache> {
  try {
    const db = await setupPersistence();
    const app = await createApp();
    return { app, db };
  } catch (err) {
    // Reset the cache so a transient cold-start failure does not poison the
    // warm container forever; the next invocation retries initialization.
    cache = null;
    throw err;
  }
}
