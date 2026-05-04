/**
 * Thrown when incoming request is invalid.
 * e.g. body does not contain required fields, contains invalid field values, etc
 */
export class ClientError extends Error {
  name: string = "ClientError";

  constructor(message: string = "Invalid Request", options?: ErrorOptions) {
    super(message, options);
  }
}

/**
 * @description throws a client error with given message
 * @param message error message
 * @returns never (function never returns)
 */
export function throwClientError(message: string): never {
  throw new ClientError(message);
}
