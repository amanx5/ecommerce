import { bindMiddlewares } from "./middleware/";
import { terminateApplication, type PersistenceHelpers } from "@/setup/";
import { addAppLog, isDevelopment, logConsole } from "@/utils";
import express from "express";

export async function setupApplication(psh: PersistenceHelpers) {
  const app = express();
  await bindMiddlewares(app, psh);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

  // Listen for HTTP requests
  const server = app.listen(port);

  server.on("listening", onServerListening);
  server.on("error", onServerError);

  // callback that executes when server starts listening
  async function onServerListening() {
    if (isDevelopment()) {
      logConsole(
        "info",
        `\n➜  Server: http://localhost:${port}`,
        "\n➜  press enter to restart",
        "\n",
      );
    }

    await addAppLog("info", `Server started on port ${port}`);
  }

  // callback that executes when server encounters an error
  async function onServerError(err: Error) {
    await addAppLog("error", "Server Error", err);
    await terminateApplication(psh.instance);
  }
}
