export class ServerError extends Error {
  name: string = "ServerError";

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
