export class ClientError extends Error {
  name: string = "ClientError";

  constructor(message: string = "Invalid Request", options?: ErrorOptions) {
    super(message, options);
  }
}
