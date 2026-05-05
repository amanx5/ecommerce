import {
  getAuthTokenFromRequest,
  verifyAuthToken,
} from "@/application/routers/auth/utils/jwt";
import type { User } from "@/persistance/models";
import { AuthStatus } from "@/types/auth";
import type { Request, Response } from "express";
import type { Attributes } from "sequelize";

export type UserDTO = Omit<
  Attributes<User>,
  "passwordHash" | "createdAt" | "updatedAt"
>;

export function toUserPublicDTO(user: User): UserDTO {
  return {
    id: user.id,
    email: user.email,
  };
}

export function setAuthStatus(req: Request, res: Response) {
  const token = getAuthTokenFromRequest(req);

  if (!token) {
    res.locals.authStatus = AuthStatus.Unauthenticated;
    return;
  }

  const userId = verifyAuthToken(token);
  if (!userId) {
    res.locals.authStatus = AuthStatus.Invalid;
    return;
  }

  res.locals.userId = userId;
  res.locals.authStatus = AuthStatus.Authenticated;
}

export function getUserId(res: Response): string | undefined {
  return res.locals.userId;
}

export function assertUserId(res: Response): string {
  const userId = getUserId(res);

  if (!userId) {
    throw new Error(
      "User ID is not set in the response locals. This route is probably not protected by authRequiredMiddleware.",
    );
  }

  return userId;
}

export function getAuthStatus(res: Response): AuthStatus {
  return res.locals.authStatus ?? AuthStatus.Unauthenticated;
}
