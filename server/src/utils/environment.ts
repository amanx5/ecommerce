export function getEnvironment() {
  return process.env.NODE_ENV;
}
export function isProduction() {
  return getEnvironment() === "production";
}

export function isDevelopment() {
  return !isProduction();
}

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is missing");
  }

  return secret;
}
