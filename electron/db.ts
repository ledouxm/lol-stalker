import isDev from "electron-is-dev";
import path from "path";
import fs from "fs/promises";
import sqlite3 from "sqlite3";

import { createConnection } from "typeorm";
const dbUrl = path.join(__dirname, "database", "lol-stalker.db");

export const makeDb = async () => {
    if (isDev) return createConnection();

    const hasDbFile = await fs.stat(dbUrl);
    if (!hasDbFile) {
        await createDbFile();
    }

    return createConnection({
        type: "sqlite",
        database: dbUrl,
        entities: [path.join(__dirname, "entities/*")],
        migrationsRun: true,
        migrations: [path.join(__dirname, "../migration/*")],
    });
};

const createDbFile = () =>
    new Promise((resolve, reject) => {
        new sqlite3.Database(dbUrl, (err) => (err ? reject(err) : resolve(true)));
    });
