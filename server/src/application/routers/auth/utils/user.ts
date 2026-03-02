import type { User } from "@/persistance/models";
import type { Response } from "express";
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

export function getUserId(res: Response) {
  const userId = res.locals.userId;

  if (!userId) {
    throw new Error("User ID is not set in the response locals");
  }

  return userId;
}
