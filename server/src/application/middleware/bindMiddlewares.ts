import {
  apiRouter,
  corsMiddleWare,
  errorMiddleware,
  imagesMiddleware,
  jsonMiddleware,
  loggerMiddleware,
  notFoundMiddleware,
  cookieParserMiddleware,
  rootHandler,
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
  app.use(corsMiddleWare);
  app.use(jsonMiddleware);

  app.get("/", rootHandler);
  app.use("/api/", apiRouter, notFoundMiddleware);
  app.use("/images/", imagesMiddleware, notFoundMiddleware);

  // catch unresolved requests
  app.use(notFoundMiddleware);

  // error handling
  app.use(errorMiddleware);
}
