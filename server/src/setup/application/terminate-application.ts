import type { PersistenceInstance } from "@/setup/";
import { addAppLog } from "@/utils";

export async function terminateApplication(
  persistanceInstance: PersistenceInstance | null,
): Promise<never> {
  await persistanceInstance?.close();

  addAppLog("info", "Terminating application.");
  process.exit(1);
}
