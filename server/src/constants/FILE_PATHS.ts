import { absolutePathExperimental } from "@/utils";

export const FILE_PATHS = {
  images: absolutePathExperimental("~/images/"),
  logs: {
    app: absolutePathExperimental("~/logs/app.log"),
    sql: absolutePathExperimental("~/logs/sql.log"),
  },
  uiBuild: absolutePathExperimental("~/dist/ui/"),
  uiBuildHtml: absolutePathExperimental("~/dist/ui/index.html"),
};
