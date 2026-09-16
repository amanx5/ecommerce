import { seedDatabase, initModelsAndAssociations } from "@/persistance/utils/";
import { addAppLog, addSqlLog, isDevelopment, isProduction } from "@/utils/";
import { Sequelize } from "sequelize";

// Static imports so Vercel's file tracer includes these packages in the
// function bundle: Sequelize loads them via dynamic `require()`, which
// tracers cannot see — without this the function crashes at boot with
// "Please install pg package manually". No runtime effect beyond the import.
import "pg";
import "pg-hstore";

export type PersistenceInstance = Sequelize;

type SyncMode = "safe" | "alter" | "none";

/**
 * Creates the Sequelize instance, authenticates, ensures the schema exists
 * and optionally seeds default data.
 *
 * Must stay free of process-lifecycle side effects (`process.exit`, …) so it
 * is safe to call from both the standalone server and serverless functions:
 * failures are thrown and each caller decides how to handle them.
 */
export async function setupPersistence(): Promise<PersistenceInstance> {
  const dbUrlKey = "DATABASE_URL";
  const dbUrl = process.env[dbUrlKey];

  if (!dbUrl) {
    throw new Error(`Environment variable ${dbUrlKey} is missing.`);
  }

  if (isProduction() && isSqliteUrl(dbUrl)) {
    throw new Error(
      "SQLite cannot be used in production: serverless functions have an ephemeral, read-only filesystem. " +
        `Set ${dbUrlKey} to a hosted Postgres URL (Neon, Supabase, …).`,
    );
  }

  const instance = new Sequelize(dbUrl, {
    logging: addSqlLog,
    logQueryParameters: !isProduction(),
    // Serverless-friendly pool: functions scale horizontally, so each
    // instance must hold as few connections as possible and release idle
    // ones instead of keeping them open forever.
    pool: {
      max: Number(process.env["DB_POOL_MAX"] ?? 2),
      min: 0,
      idle: 10_000,
      acquire: 30_000,
      evict: 10_000,
    },
  });

  try {
    await instance.authenticate();
    initModelsAndAssociations(instance);

    const syncMode = resolveSyncMode();
    if (syncMode === "alter") {
      if (isProduction()) {
        await addAppLog("warn", "Skipping DB_SYNC=alter [production]");
      } else {
        await instance.sync({ alter: true });
      }
    } else if (syncMode === "safe") {
      await instance.sync();
    }

    if (shouldSeed()) {
      await seedDatabase();
    }

    return instance;
  } catch (err) {
    await instance.close().catch(() => undefined);
    await addAppLog("error", "Failed to set up persistence layer.", err);
    throw err;
  }
}

function isSqliteUrl(dbUrl: string): boolean {
  return dbUrl.startsWith("sqlite:");
}

function resolveSyncMode(): SyncMode {
  const raw = process.env["DB_SYNC"]?.trim().toLowerCase();

  return raw && ["safe", "alter", "none"].includes(raw)
    ? (raw as SyncMode)
    : "safe";
}

function shouldSeed(): boolean {
  // Seed by default outside production so a fresh local database just works.
  if (isDevelopment()) return true;

  const raw = process.env["DB_SEED"]?.trim().toLowerCase();

  return raw === "true";
}
