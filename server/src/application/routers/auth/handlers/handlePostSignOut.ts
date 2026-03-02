import { TOKEN_COOKIE_OPTIONS } from "@/application/routers/auth/utils";
import { Responder } from "@/application/utils/Responder";
import type { RequestHandler } from "express";

export const handlePostSignOut: RequestHandler = async (_req, res) => {
  try {
    res.clearCookie("token", TOKEN_COOKIE_OPTIONS);
    return Responder.noContent(res);
  } catch (err) {
    return Responder.error(res, "Failed to sign-out", err);
  }
};
