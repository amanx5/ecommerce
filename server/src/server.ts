import { createApp } from "@/application/createApp";
import { setupPersistence } from "@/persistance";
import { addAppLog } from "@/utils";

try {
  const persistanceInstance = await setupPersistence();
  const app = await createApp();

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

  const server = app.listen(port);

  server.on("listening", async () => {
    await addAppLog("info", `Server started: http://localhost:${port}`);
  });

  server.on("error", async (err) => {
    await addAppLog("error", "Server Error", err);
    await persistanceInstance.close().catch(() => undefined);
    process.exit(1);
  });
} catch (err) {
  await addAppLog("error", "Failed to start server.", err);
  process.exit(1);
}
