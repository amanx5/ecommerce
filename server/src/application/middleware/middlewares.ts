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
import { FILE_PATHS, HttpStatus } from "@/constants";
import { AuthStatus } from "@/types/auth";
import { FRONTEND_URLS } from "@/utils/client";
import { addRequestLog } from "@/utils/loggers";
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
// - `cors` sets headers like Access-Control-Allow-Origin, etc. then propagates by calling next()
// ******************************************************************************************************************
// Middleware to parse cookies and attach them as a `cookies` object to the request.
// Note: By default, Express does not populate `req.cookies`; it only provides `req.headers.cookie` as a raw string.
const cookieParserMiddleware = cookieParser();
// allow cors with frontend
const corsMiddleWare = cors({
  origin: FRONTEND_URLS,
  // it adds response header `Access-Control-Allow-Credentials: true` which instructs the browser that the server is
  // willing to accept credentials (cookies) from this Origin.
  // if this is not set true, then the browser though receives the response but doesn't allow the frontend to read it
  // this is basically server accepting handshake of the frontend for cookies
  credentials: true,
});

//
// ******************************************************************************************************************
//                                          Built-in middlewares
//                                          ~~~~~~~~~~~~~~~~~~~~
// - These are shipped/available in express package itself.
// - `express.json` only parses json & only looks at requests where the Content-Type header matches the type option.
// - `express.static` serves static files & doesn't propagate when request URL matches with `root` directory argument
// ******************************************************************************************************************
const jsonMiddleware = express.json();
const imagesMiddleware = express.static(FILE_PATHS.images);

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

const rootHandler: RequestHandler = (_req, res) => {
  const primaryUrl = FRONTEND_URLS[0] || "unknown";
  res.send(`
    <div style="font-family: sans-serif; padding: 20px;">
      <p>Status: <span style="color: #2ecc71; font-weight: bold;">Online</span></p>
      <p>The backend services are running. Access the storefront at: <a href="${primaryUrl}">${primaryUrl}</a></p>
    </div>
  `);
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
  corsMiddleWare,
  errorMiddleware,
  imagesMiddleware,
  rootHandler,
  jsonMiddleware,
  loggerMiddleware,
  notFoundMiddleware,
};
