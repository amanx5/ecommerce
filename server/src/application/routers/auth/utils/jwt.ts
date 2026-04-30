import { type UserDTO } from "@/application/routers/auth/utils/user";
import type { User } from "@/persistance/models";
import {
  getAuthSecret,
  isNumber,
  isObject,
  isProduction,
  isString,
} from "@/utils/";
import type { Request, CookieOptions, Response } from "express";
import crypto from "node:crypto";

export const TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProduction(),

  // When the frontend is on an origin (e.g. abc.vercel.app) and sends an API request to the server
  // which is on a different origin (e.g. abc.onrender.com) with `credentials: "include"`,
  // then the browsers typically do NOT include the cookies (which have "strict" value of sameSite attribute) in the request.
  // As a result, authRequiredMiddleware will continuously return 401 Unauthorized due to missing token cookie.
  //
  // But since currently the frontend and backend are on different origins, we will need to set the value of sameSite attribute to "none"
  // sameSite: "strict" can be used in following scenarios:
  //  - In development: if the frontend proxies the requests with the same Origin.
  //  - In production: if the frontend and backend are on the same origin
  sameSite: isProduction() ? "none" : "lax",
};

export const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function base64UrlEncode(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(input: string) {
  const padLength = (4 - (input.length % 4)) % 4;
  const padded =
    input.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(padLength);

  return Buffer.from(padded, "base64").toString("utf8");
}

export function signAuthToken(userDTO: UserDTO): string {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };
  const now = Date.now();
  const payload = {
    sub: userDTO,
    iat: Math.floor(now / 1000),
    exp: Math.floor((now + TOKEN_TTL_MS) / 1000),
  };

  const headerEncoded = base64UrlEncode(JSON.stringify(header));
  const payloadEncoded = base64UrlEncode(JSON.stringify(payload));

  const data = `${headerEncoded}.${payloadEncoded}`;
  const signature = crypto
    .createHmac("sha256", getAuthSecret())
    .update(data)
    .digest("base64url");

  return `${data}.${signature}`;
}

export function setAuthTokenInResponse(res: Response, userDTO: UserDTO) {
  const token = signAuthToken(userDTO);

  res.cookie("token", token, {
    ...TOKEN_COOKIE_OPTIONS,
    maxAge: TOKEN_TTL_MS,
  });
}

export function getAuthTokenFromRequest(req: Request): string | null {
  if (
    !isObject(req.cookies) ||
    !isString(req.cookies.token) ||
    !req.cookies.token.length
  ) {
    return null;
  }

  return req.cookies.token;
}

export function verifyAuthToken(token: string): User["id"] | null {
  const [headerEncoded, payloadEncoded, signature] = token.split(".");
  if (!headerEncoded || !payloadEncoded || !signature) {
    return null;
  }

  const data = `${headerEncoded}.${payloadEncoded}`;
  const expectedSignature = crypto
    .createHmac("sha256", getAuthSecret())
    .update(data)
    .digest("base64url");

  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );

  if (!isValid) {
    return null;
  }

  const payloadJson = base64UrlDecode(payloadEncoded);
  const payload = JSON.parse(payloadJson);

  const nowSeconds = Math.floor(Date.now() / 1000);

  if (
    !isObject(payload) ||
    !isObject(payload.sub) ||
    !isString(payload.sub.id) ||
    !isNumber(payload.exp) ||
    payload.exp < nowSeconds
  ) {
    return null;
  }

  return payload.sub.id;
}
