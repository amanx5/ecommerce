import { bindMiddlewares } from "@/application/middleware/bindMiddlewares";
import express from "express";

export async function createApp(): Promise<express.Express> {
  const app = express();
  await bindMiddlewares(app);
  return app;
}
