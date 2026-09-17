import {
  authRouter,
  cartItemsRouter,
  deliveryOptionsRouter,
  ordersRouter,
  paymentSummaryRouter,
  productsRouter,
} from "@/application/routers";
import { getAuthStatus, setAuthStatus } from "@/application/routers/auth/utils";
import { Responder } from "@/application/utils";
import { HttpStatus } from "@/constants";
import { AuthStatus } from "@/types/auth";
import { addRequestLog } from "@/utils/loggers";
import { getTrustedOrigins } from "@/utils/environment";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type RequestHandler,
  type ErrorRequestHandler,
} from "express";

//
// ******************************************************************************************************************
//                                          Third-party middlewares
//                                          ~~~~~~~~~~~~~~~~~~~~~~~
// - These are shipped/available at external sources.
// ******************************************************************************************************************
// Middleware to parse cookies and attach them as a `cookies` object to the request.
// Note: By default, Express does not populate `req.cookies`; it only provides `req.headers.cookie` as a raw string.
const cookieParserMiddleware = cookieParser();

// The UI calls the API cross-origin, so browsers enforce CORS on API calls.
// Credentialed requests (our auth cookie) need an explicit allowed origin
// plus preflight handling, which this provides.
const corsMiddleware = cors({
  origin:  getTrustedOrigins(),
  credentials: true,
});

//
// ******************************************************************************************************************
//                                          Built-in middlewares
//                                          ~~~~~~~~~~~~~~~~~~~~
// - These are shipped/available in express package itself.
// - `express.json` only parses json & only looks at requests where the Content-Type header matches the type option.
// ******************************************************************************************************************
const jsonMiddleware = express.json();

// NOTE: Product images are static assets shipped with the API
// (`server/public/images` → served from the site root as `/images/*`).
// On Vercel they come from the CDN (`public/`); locally and standalone they
// are served by `express.static()` in bindMiddlewares. Either way they never
// touch the `/api` chain, so per-request cold-start cost stays off images.

//
// ******************************************************************************************************************
//                                       Application-level middlewares
//                                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// - Any middleware which is bound to an instance of express()
// ******************************************************************************************************************
const loggerMiddleware: RequestHandler = (req, res, next) => {
  res.locals.start = process.hrtime.bigint();

  res.on("finish", () => addRequestLog(req, res));

  next();
};

// Liveness probe for uptime checks and the UI cold-start notice.
// Intentionally DB-free so it answers instantly on warm containers.
const healthHandler: RequestHandler = (_req, res) => {
  return Responder.success(res, HttpStatus.OK, "OK", { status: "ok" });
};

// Root landing page (thumbs-up). Served by the app (not static) because
// directory-index resolution does not apply next to the function catch-all
// on Vercel, and rewrites route into the function instead of static files.
const rootHandler: RequestHandler = (_req, res) => {
  res.send(
    `<style>html,body{margin:0;padding:0;height:100%;overflow:hidden;}</style><div style="display:flex;align-items:center;justify-content:center;height:100vh;font-size:10rem;">👍</div>`,
  );
};

const notFoundMiddleware: RequestHandler = (_req, res, _next) => {
  res.sendStatus(404);
};

//
// ******************************************************************************************************************
//                                        Router-level middlewares
//                                        ~~~~~~~~~~~~~~~~~~~~~~~~
// - Any middleware which is bound to an instance of express.Router()
// ******************************************************************************************************************
const authStatusMiddleware: RequestHandler = (req, res, next) => {
  setAuthStatus(req, res);
  next();
};

const authRequiredMiddleware: RequestHandler = (_req, res, next) => {
  const status = getAuthStatus(res);

  let authMissingMessage;
  if (status === AuthStatus.Unauthenticated) {
    authMissingMessage = "Please login to continue.";
  } else if (status === AuthStatus.Invalid) {
    authMissingMessage = "Session is expired or invalid. Please login again.";
  }

  if (authMissingMessage) {
    return Responder.failure(res, HttpStatus.UNAUTHORIZED, authMissingMessage);
  }

  return next();
};

const apiRouter = express.Router();
apiRouter.use(authStatusMiddleware);
apiRouter.use("/auth", authRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/deliveryOptions", deliveryOptionsRouter);
apiRouter.use(authRequiredMiddleware);
apiRouter.use("/cartItems", cartItemsRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/paymentSummary", paymentSummaryRouter);

//
// ******************************************************************************************************************
//                                        Error-handling middleware
//                                        ~~~~~~~~~~~~~~~~~~~~~~~~~
// - Same as Application-level, but the function signature is different.
// - Special middleware, it is triggered only when next(err) is called
// - It must be added without a path
// - It must be last
// ******************************************************************************************************************
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  return Responder.error(res, "Something went wrong", err);
};

export {
  apiRouter,
  authStatusMiddleware,
  cookieParserMiddleware,
  corsMiddleware,
  errorMiddleware,
  healthHandler,
  jsonMiddleware,
  loggerMiddleware,
  notFoundMiddleware,
  rootHandler,
};
