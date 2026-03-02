import { Responder } from "@/application/utils/";
import {
  hashPassword,
  toUserPublicDTO,
} from "@/application/routers/auth/utils";
import { HttpStatus } from "@/constants";
import { User } from "@/persistance/models";
import { isString } from "@/utils";
import type { RequestHandler } from "express";
import { ValidationError } from "sequelize";

export const handlePostRegister: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!isString(email) || email.length < 1) {
      return Responder.failure(
        res,
        HttpStatus.BAD_REQUEST,
        "Email is required",
      );
    }

    if (!isString(password) || password.length < 6) {
      return Responder.failure(
        res,
        HttpStatus.UNPROCESSABLE_ENTITY,
        "Password must be at least 6 characters long",
      );
    }

    const userExisting = await User.findOne({ where: { email } });
    if (userExisting) {
      return Responder.failure(
        res,
        HttpStatus.CONFLICT,
        "A user with this email already exists",
      );
    }

    const passwordHash = hashPassword(password);
    const userCreated = await User.create({ email, passwordHash });

    return Responder.success(
      res,
      HttpStatus.CREATED,
      "User registered successfully",
      toUserPublicDTO(userCreated),
    );
  } catch (err) {
    if (err instanceof ValidationError) {
      const invalidFields = err.errors
        .map((e) =>
          e.path ? e.path.at(0)?.toUpperCase() + e.path.slice(1) : null,
        )
        .filter((p) => p != null);
      const invalidFieldsStr = invalidFields.join(", ");
      const failureMessage = invalidFields.length
        ? `${invalidFieldsStr} ${invalidFields.length == 1 ? "field is" : "fields are"} invalid`
        : "Fields are invalid";

      return Responder.failure(
        res,
        HttpStatus.UNPROCESSABLE_ENTITY,
        failureMessage,
      );
    }

    return Responder.error(res, "Failed to register", err);
  }
};
