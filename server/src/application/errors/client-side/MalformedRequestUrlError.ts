import { ClientError } from "@/application/errors/";

export class MalformedRequestUrlError extends ClientError {
  name: string = "MalformedRequestUrlError";

  constructor(msg: string = "Malformed Request URL", options?: ErrorOptions) {
    super(msg, options);
  }
}
