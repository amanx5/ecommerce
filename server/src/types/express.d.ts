import type { ServerError } from "@/application/errors";
import { AuthStatus } from "./auth";
import "express";

declare module "express-serve-static-core" {
  interface Locals {
    start?: bigint;
    error?: ServerError;
    userId?: string;
    authStatus?: AuthStatus;
  }
}
