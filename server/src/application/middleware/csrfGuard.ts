import { Responder } from "@/application/utils";
import { HttpStatus } from "@/constants";
import { FRONTEND_URL } from "@/utils/client";
import { addAppLog } from "@/utils/loggers";
import { type RequestHandler } from "express";

/**
 * CSRF Guard: Protects against Cross-Site Request Forgery.
 *
 * ## CORS vs CSRF
 * - **CORS** is designed to stop a malicious site from **READING** your data (Protects Privacy).
 * - **CSRF Protection** is designed to stop a malicious site from **PERFORMING AN ACTION** on your data (Protects Integrity).
 *
 * ## The <form> Loophole
 * Modern browser requests (`fetch`, `axios`) are protected by CORS because they send a "Preflight" request (OPTIONS)
 * to ask permission. However, traditional HTML `<form>` tags do **not** trigger a preflight.
 *
 * ## Example Attack Vector:
 * 1. An attacker puts this on their site (`evil.com`):
 *    ```html
 *    <form action="https://your-api.onrender.com/api/orders/cancel-all" method="POST">
 *      <input type="submit" value="Click for a Free Gift!">
 *    </form>
 *    ```
 * 2. A user who is logged into your store visits `evil.com` and clicks the button.
 * 3. The browser sends a POST request to your API.
 * 4. **CORS is ignored** because the browser treats this as a "Simple Request". It doesn't ask for permission.
 * 5. Because we use `SameSite: None`, the browser **attaches the user's auth cookie** to this request.
 * 6. Your server sees a valid cookie and processes the request (cancels the orders).
 *
 * ## Why this middleware is needed:
 * CORS only blocks the browser from *reading* the response after the request is finished. By then, the "damage"
 * (the database action) has already happened. This middleware stops the request **before** it hits your logic
 * by ensuring the `Origin` header matches our `frontendUrl`.
 *
 * Using `SameSite: Strict` is the best fix, but that only works if the UI and API are on the same domain.
 */
export const csrfGuard: RequestHandler = (req, res, next) => {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  const origin = req.headers.origin;

  // If the request has an Origin and it doesn't match our frontend, block it.
  // This stops cross-site malicious requests from acting on the user's session.
  if (origin && origin !== FRONTEND_URL) {
    addAppLog(
      "warn",
      `[Potential CSRF Blocked] Request from unauthorized origin: ${origin}`,
    );
    return Responder.failure(
      res,
      HttpStatus.FORBIDDEN,
      "Action blocked: Potential CSRF attempt detected.",
    );
  }

  next();
};
