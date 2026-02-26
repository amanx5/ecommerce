import { absolutePathExperimental } from "@/utils";

export const FILE_PATHS = {
  apiPublic: absolutePathExperimental("@/api/public/"),
  database: absolutePathExperimental("~/database.sqlite"),
  images: absolutePathExperimental("~/images/"),
  logs: {
    app: absolutePathExperimental("~/logs/app.log"),
    sql: absolutePathExperimental("~/logs/sql.log"),
  },
  uiBuild: absolutePathExperimental("~/dist/ui/"),
  uiBuildHtml: absolutePathExperimental("~/dist/ui/index.html"),
};
