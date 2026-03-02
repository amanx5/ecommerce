import {
  getAuthTokenFromRequest,
  toUserPublicDTO,
  verifyAuthToken,
  type UserDTO,
} from "@/application/routers/auth/utils";
import { Responder } from "@/application/utils/";
import { User } from "@/persistance/models";
import { RequestHandler } from "express";

export const handleGetUser: RequestHandler = async (req, res) => {
  try {
    let id = null,
      user = null;

    const token = getAuthTokenFromRequest(req);

    if (token) {
      id = verifyAuthToken(token);
    }

    if (id) {
      const userFound = await User.findByPk(id);

      if (userFound) {
        user = toUserPublicDTO(userFound);
      }
    }

    return Responder.success<UserDTO | null>(
      res,
      200,
      "User retrieved successfully",
      user,
    );
  } catch (err) {
    return Responder.error(res, "Failed to retrieve user", err);
  }
};
