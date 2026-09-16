import { Responder } from "@/application/utils";
import { HttpStatus } from "@/constants";
import { getTrustedOrigins } from "@/utils/environment";
import { addAppLog } from "@/utils/loggers";
import { type RequestHandler } from "express";

const TRUSTED_ORIGINS = getTrustedOrigins();
const CSRF_SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];
const CSRF_DETECTED_MSG = "Action blocked: Potential CSRF attempt detected.";

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
 * 5. If the cookie was set with `SameSite: None`, the browser **attaches the user's auth cookie** to this request.
 * 6. The server sees a valid cookie and processes the request (cancels the orders).
 *
 * ## Why CSRF Protection is needed:
 * CORS only blocks the browser from *reading* the response after the request is finished. By then, the "damage"
 * (the database action) has already happened. On the other hand, CSRF protection stops the request **before**
 * it reaches route handlers.
 *
 * ## Some basic approaches to prevent CSRF:
 * 1. Set auth cookies with `SameSite: Strict` or `SameSite: lax`. This ensures the client browser doesn't include
 *    that cookie if the client is on a different domain.
 * 2. Check whether the origin host is valid. Reject state-changing requests (like POST, PUT, DELETE) whose `Origin`
 *    host does not match the request's own `Host` (OWASP Origin-vs-Host check).
 *
 *    For example:
 *    `POST https://api.myshop.com/api/orders` with `Origin: https://evil.com` is rejected with 403
 *    (`evil.com` matches neither the API's own host `api.myshop.com` nor the `TRUSTED_ORIGINS` allowlist),
 *    while the same request with `Origin: https://myshop.com` is allowed through the allowlist.
 *
 *    Same-site alone is not enough: `POST https://api.shop.com/api/orders`
 *    with `Origin: https://evil.shop.com` is still rejected with 403. The
 *    browser treats the two as same-site and would even attach `Strict`
 *    cookies — but `evil.shop.com` is neither the API's own host
 *    (`api.shop.com`) nor on the allowlist. Only an exact allowlisted
 *    origin such as `Origin: https://shop.com` passes.
 */
export const csrfGuard: RequestHandler = (req, res, next) => {
  const origin = req.headers.origin;
  const originHost = extractHostFromOrigin(origin);
  const targetHost = req.headers.host;

  // accepts request without an `Origin` header (curl/non-browser clients: they cannot exploit a victim's browser session)
  // accepts request from clients having same host as the server (OWASP Origin-vs-Host check)
  // accepts request from trusted origins
  // accepts request with safe methods
  if (
    !origin ||
    originHost === targetHost ||
    TRUSTED_ORIGINS.includes(origin) ||
    CSRF_SAFE_METHODS.includes(req.method)
  ) {
    return next();
  }

  addAppLog("warn", `Blocked potential CSRF; Origin: ${origin}`);
  return Responder.failure(res, HttpStatus.FORBIDDEN, CSRF_DETECTED_MSG);
};

/**
 * Extract the `host` (hostname + port) from an `Origin` header value.
 *
 * The port is included when explicitly present in the URL (`URL` drops it
 * when it is the scheme default, e.g. `:443` for https) — the same shape as
 * `req.headers.host`, which this is compared against.
 *
 * @example
 * extractHostFromOrigin("https://myshop.com"); // "myshop.com"
 * extractHostFromOrigin("https://myshop.com:443"); // "myshop.com"
 * extractHostFromOrigin("http://localhost:5000"); // "localhost:5000"
 * extractHostFromOrigin("not-a-url"); // null
 * extractHostFromOrigin(undefined); // null
 */
function extractHostFromOrigin(origin: string | undefined): string | null {
  if (!origin || origin.trim() === "") return null;

  try {
    return new URL(origin).host;
  } catch {
    return null;
  }
}
