import {
  authRouter,
  cartItemsRouter,
  deliveryOptionsRouter,
  ordersRouter,
  paymentSummaryRouter,
  productsRouter,
} from "@/application/routers";
import {
  getAuthTokenFromRequest,
  verifyAuthToken,
} from "@/application/routers/auth/utils";
import { Responder } from "@/application/utils";
import { FILE_PATHS, HttpStatus } from "@/constants";
import { addRequestLog } from "@/utils";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type RequestHandler,
  type ErrorRequestHandler,
} from "express";

const uiDevUrlEnvKey = "DEV_UI_URL";
const uiDevUrl = process.env[uiDevUrlEnvKey];

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
  origin: uiDevUrl,
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
const uiBuildMiddleware = express.static(FILE_PATHS.uiBuild);

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

const uiProductionMiddleware: RequestHandler = (_req, res) => {
  // uiBuildHtml will handle all future requests if sendFile completes without error
  res.sendFile(FILE_PATHS.uiBuildHtml, (err) => {
    // if transfer failed
    if (err && !res.headersSent) {
      const isFileMissing = "code" in err && err.code === "ENOENT"; // ErrorNoENTry
      Responder.error(
        res,
        isFileMissing ? "Webpage not available" : "Something went wrong",
        err,
      );
    }
  });
};

const uiDevelopmentMiddleware: RequestHandler = (req, res) => {
  if (uiDevUrl) {
    res.redirect(uiDevUrl + req.originalUrl);
  } else {
    Responder.error(
      res,
      "Configuration Error",
      `Environment variable "${uiDevUrlEnvKey}" is missing.`,
    );
  }
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
const authRequiredMiddleware: RequestHandler = (req, res, next) => {
  const token = getAuthTokenFromRequest(req);
  if (!token) {
    return Responder.failure(
      res,
      HttpStatus.UNAUTHORIZED,
      "Please login to continue",
    );
  }

  const userId = verifyAuthToken(token);
  if (!userId) {
    return Responder.failure(
      res,
      HttpStatus.UNAUTHORIZED,
      "Session is expired or invalid. Please login again to continue",
    );
  }

  res.locals.userId = userId;

  return next();
};

const apiRouter = express.Router();
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
  cookieParserMiddleware,
  corsMiddleWare,
  errorMiddleware,
  imagesMiddleware,
  jsonMiddleware,
  loggerMiddleware,
  notFoundMiddleware,
  uiBuildMiddleware,
  uiDevelopmentMiddleware,
  uiProductionMiddleware,
};
