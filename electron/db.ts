import isDev from "electron-is-dev";
import path from "path";

import { createConnection } from "typeorm";
const dbUrl = path.join(__dirname, "database", "lol-stalker.db");
// export const db = new sqlite3.Database(dbUrl);

export const makeDb = () =>
    isDev
        ? createConnection()
        : createConnection({
              type: "sqlite",
              database: dbUrl,
              entities: [path.join(__dirname, "entities/*")],
          });
