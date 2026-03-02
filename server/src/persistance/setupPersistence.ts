import { terminateApplication } from "@/application/utils";
import { FILE_PATHS } from "@/constants/";
import { seedDatabase } from "@/persistance/utils/";
import { initAllModels } from "@/persistance/utils/initAllModels";
import {
  addAppLog,
  addSqlLog,
  isProduction,
} from "@/utils/";
import { Sequelize } from "sequelize";

export type PersistenceInstance = Sequelize;

export async function setupPersistence(): Promise<PersistenceInstance> {
  let instance: Sequelize | null = null;

  try {
    if (isProduction()) {
      const dbUrl = process.env.DATABASE_URL;
      if (!dbUrl) {
        throw new Error("Environment variable `DATABASE_URL` is missing.");
      }

      instance = new Sequelize(dbUrl, {
        dialect: "postgres",
        dialectOptions: {
          ssl: { rejectUnauthorized: false },
        },
        logging: addSqlLog,
      });
    } else {
      instance = new Sequelize({
        dialect: "sqlite",
        storage: FILE_PATHS.database,
        logging: addSqlLog,
        logQueryParameters: true,
      });
    }

    await instance.authenticate();
    initAllModels(instance);

    // TODO: use migrations in production
    await instance.sync();
    await seedDatabase();

    return instance;
  } catch (err) {
    addAppLog("error", "Failed to set up persistence layer.", err);

    return await terminateApplication(instance);
  }
}
