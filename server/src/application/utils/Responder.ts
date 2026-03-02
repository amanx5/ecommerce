import { ServerError } from "@/application/errors";
import { HttpStatus } from "@/constants";
import { type Response } from "express";

export type SuccessHttpStatus =
  | HttpStatus.OK
  | HttpStatus.CREATED
  | HttpStatus.CREATED;

export type FailureHttpStatus =
  | HttpStatus.BAD_REQUEST
  | HttpStatus.UNAUTHORIZED
  | HttpStatus.FORBIDDEN
  | HttpStatus.NOT_FOUND
  | HttpStatus.CONFLICT
  | HttpStatus.UNPROCESSABLE_ENTITY;

export type ErrorHttpStatus =
  | HttpStatus.INTERNAL_SERVER_ERROR
  | HttpStatus.BAD_GATEWAY
  | HttpStatus.SERVICE_UNAVAILABLE;

export type ResponseBody<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

export class Responder {
  static success<T>(
    res: Response,
    status: SuccessHttpStatus = HttpStatus.OK,
    message = "The request was completed successfully.",
    data: T,
  ) {
    const body: ResponseBody<T> = {
      success: true,
      message,
      data,
    };

    return res.status(status).json(body);
  }

  static noContent(res: Response) {
    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  static failure(
    res: Response,
    status: FailureHttpStatus = HttpStatus.BAD_REQUEST,
    message = "The request was failed.",
  ) {
    const body: ResponseBody = {
      success: false,
      message,
    };

    return res.status(status).json(body);
  }

  /**
   * Call this method to finish the response with an error.
   * It will also log the error details in the server logs for debugging purposes.
   *
   * @param message Message for the client. Make sure it does not contain sensitive information,
   * as it will be sent to the client in the response.
   *
   * @param cause The original error object or any relevant information about the error cause.
   */
  static error(res: Response, message: string, cause: unknown) {
    const serverError = new ServerError(message, { cause });

    res.locals.error = serverError;

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message,
    });
  }
}
