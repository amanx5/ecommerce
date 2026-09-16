import { csrfGuard } from "@/application/middleware/csrfGuard";
import {
  apiRouter,
  corsMiddleware,
  errorMiddleware,
  healthHandler,
  jsonMiddleware,
  loggerMiddleware,
  notFoundMiddleware,
  cookieParserMiddleware,
} from "@/application/middleware/middlewares";
import { resolveFromServerRoot } from "@/utils/environment";
import express, { type Express } from "express";

const publicDir = resolveFromServerRoot("public");

/**
 * Binds Middlewares to the express app.
 * - Middlewares are bound to an express application or a router by calling:
 *  .use(...);
 *    OR
 *  .<method>(...);   // where <method> is [request method](https://expressjs.com/en/5x/api.html#app.METHOD)
 *
 * - A middleware can propagate (allow next middlewares to execute) by calling next() or next(err)
 *
 * @see https://expressjs.com/en/guide/using-middleware.html
 */
export async function bindMiddlewares(app: Express) {
  // Static assets (`server/public/**` → `/...`). On Vercel these are served
  // from the CDN and `express.static()` is ignored, so this only takes effect
  // for local dev and standalone hosting.
  app.use(express.static(publicDir));

  // CORS first so preflights short-circuit before logging/auth logic.
  app.use(corsMiddleware);
  app.use(cookieParserMiddleware);
  app.use(loggerMiddleware);
  app.use(csrfGuard);
  app.use(jsonMiddleware);

  // Registered before the `/api/` chain so the probe never hits auth/404 logic.
  app.get("/api/health", healthHandler);
  app.use("/api/", apiRouter, notFoundMiddleware);

  // catch unresolved requests
  app.use(notFoundMiddleware);

  // error handling
  app.use(errorMiddleware);
}
