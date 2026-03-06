import { terminateApplication } from "@/application/utils";
import { FILE_PATHS } from "@/constants/";
import { seedDatabase, initModelsAndAssociations } from "@/persistance/utils/";
import { addAppLog, addSqlLog, isDevelopment } from "@/utils/";
import { Sequelize } from "sequelize";

export type PersistenceInstance = Sequelize;

export async function setupPersistence(): Promise<PersistenceInstance> {
  let instance: Sequelize | null = null;
  const dbUrlKey = "DATABASE_URL";
  const dbUrl = process.env[dbUrlKey];
  const isDev = isDevelopment();
  const logging = addSqlLog;
  const logQueryParameters = isDev;

  try {
    if (!dbUrl) {
      throw new Error(`Environment variable ${dbUrlKey} is missing.`);
    }

    instance = new Sequelize(dbUrl, {
      logging,
      logQueryParameters,
    });

    await instance.authenticate();
    initModelsAndAssociations(instance);

    await instance.sync({ alter: true });
    await seedDatabase();

    return instance;
  } catch (err) {
    addAppLog("error", "Failed to set up persistence layer.", err);

    return await terminateApplication(instance);
  }
}
