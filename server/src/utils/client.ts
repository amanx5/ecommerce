import { isDevelopment } from "@/utils/environment";

export function getFrontendUrl() {
  let frontendUrl = process.env["FRONTEND_URL"];

  // fallback to localhost in development mode if FRONTEND_URL is not set
  if (isDevelopment() && !frontendUrl) {
    frontendUrl = "http://localhost:5173";
  }

  // trim and remove trailing slashes, browsers(client) never send Origin header with trailing slash
  frontendUrl = frontendUrl?.trim().replace(/\/+$/, "");

  return frontendUrl;
}
