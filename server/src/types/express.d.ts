import type { ServerError } from "@/application/errors";
import "express";

declare module "express-serve-static-core" {
  interface Locals {
    start?: bigint;
    error?: ServerError;
    userId?: string;
  }
}
