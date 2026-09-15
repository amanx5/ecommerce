import { csrfGuard } from "@/application/middleware/csrfGuard";
import {
  apiRouter,
  errorMiddleware,
  healthHandler,
  jsonMiddleware,
  loggerMiddleware,
  notFoundMiddleware,
  cookieParserMiddleware,
} from "./middlewares";
import { type Express } from "express";

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
