import { bindMiddlewares } from "@/application/middleware/bindMiddlewares";
import {
  setupPersistence,
  type PersistenceInstance,
} from "@/persistance/setupPersistence";
import { getTrustedOrigins, isProduction } from "@/utils/environment";
import type { Express } from "express";
import express from "express";

/**
 * Shared boot step for every runtime (local dev, Vercel serverless):
 * connects persistence, then builds the Express app.
 */
export async function init(): Promise<{
  app: Express;
  db: PersistenceInstance;
}> {
  // Without trusted origins in production, every state changing requests is rejected as CSRF.
  // So, validate config first so it fails loudly on missing variable instead of serving broken requests later on.
  if (isProduction() && getTrustedOrigins().length === 0) {
    throw new Error("TRUSTED_ORIGINS is not set.");
  }

  const db = await setupPersistence();
  const app = express();
  // Behind Vercel's (or any) reverse proxy so `req.protocol`/`req.ip` reflect
  // the real client — required for `Secure` cookies and correct logging.
  app.set("trust proxy", 1);
  await bindMiddlewares(app);

  return { app, db };
}
