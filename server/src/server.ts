import { init } from "@/init";
import { addAppLog } from "@/utils";

// Standalone entry for local dev and non-Vercel hosting
try {
  const { app, db } = await init();

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

  const server = app.listen(port);

  server.on("listening", async () => {
    await addAppLog("info", `Server started: http://localhost:${port}`);
  });

  server.on("error", async (err) => {
    await addAppLog("error", "Server Error", err);
    await db.close().catch(() => undefined);
    process.exit(1);
  });
} catch (err) {
  await addAppLog("error", "Failed to start server.", err);
  process.exit(1);
}
