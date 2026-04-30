import { isDevelopment } from "@/utils/environment";

function getFrontendUrls(): string[] {
  const envUrl = process.env["FRONTEND_URL"];

  // Default for development
  if (isDevelopment() && !envUrl) {
    return ["http://localhost:5173"];
  }

  if (!envUrl) return [];

  // Split by comma, trim whitespace, and remove trailing slashes from each URL
  return envUrl
    .split(",")
    .map((url) => url.trim().replace(/\/+$/, ""))
    .filter((url) => url.length > 0);
}

export const FRONTEND_URLS = getFrontendUrls();
