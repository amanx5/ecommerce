import { Responder } from "@/application/utils/";
import {
  signAuthToken,
  TOKEN_COOKIE_OPTIONS,
  TOKEN_TTL_MS,
  toUserPublicDTO,
  verifyPassword,
} from "@/application/routers/auth/utils";
import { HttpStatus } from "@/constants";
import { User } from "@/persistance/models";
import { isString } from "@/utils";
import type { RequestHandler } from "express";

export const handlePostSignIn: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !isString(email)) {
      return Responder.failure(
        res,
        HttpStatus.BAD_REQUEST,
        "Email is required",
      );
    }

    if (!password || !isString(password)) {
      return Responder.failure(
        res,
        HttpStatus.BAD_REQUEST,
        "Password is required",
      );
    }

    const userFound = await User.findOne({ where: { email } });

    if (!userFound) {
      // generic message to avoid user enumeration
      return Responder.failure(
        res,
        HttpStatus.UNAUTHORIZED,
        "Email or password is incorrect",
      );
    }

    const isValid = verifyPassword(password, userFound.passwordHash);
    if (!isValid) {
      return Responder.failure(
        res,
        HttpStatus.UNAUTHORIZED,
        "Email or password is incorrect",
      );
    }

    const userDTO = toUserPublicDTO(userFound);
    const token = signAuthToken(userDTO);

    res.cookie("token", token, {
      ...TOKEN_COOKIE_OPTIONS,
      maxAge: TOKEN_TTL_MS,
    });

    return Responder.success(res, HttpStatus.OK, "Sign-in successful", userDTO);
  } catch (err) {
    return Responder.error(res, "Failed to sign-in", err);
  }
};
