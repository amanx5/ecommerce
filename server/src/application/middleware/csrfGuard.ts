import { Responder } from "@/application/utils";
import { HttpStatus } from "@/constants";
import { addAppLog } from "@/utils/loggers";
import { type RequestHandler } from "express";

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
 * 2. Check whether the origin host is valid. This guard rejects state-changing requests whose `Origin` host does 
 *    not match the request's own `Host` (OWASP Origin-vs-Host check).
 */
export const csrfGuard: RequestHandler = (req, res, next) => {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  const origin = req.headers.origin;
  const originHost = getOriginHost(origin);
  const targetHost = req.headers.host;
  const block = () =>
    Responder.failure(res, HttpStatus.FORBIDDEN, CSRF_DETECTED_MSG);

  if (safeMethods.includes(req.method)) return next();

  // Requests without an `Origin` header (curl, non-browser clients) are allowed through; they cannot exploit a victim's browser session.
  if (!origin) return next();

  // rejects state-changing requests whose `Origin` host does not match the request's own `Host` (OWASP Origin-vs-Host check).
  if (!originHost) return block();

  // Request's origin host must match hostname of the server (UI and server are hosted on same domain)
  if (!targetHost || originHost !== targetHost) {
    addAppLog("warn", `Blocked potential CSRF; Origin: ${origin}`);
    return block();
  }

  next();
};

function getOriginHost(origin: string | undefined): string | null {
  if (!origin || origin.trim() === "") return null;

  try {
    return new URL(origin).host;
  } catch {
    return null;
  }
}
