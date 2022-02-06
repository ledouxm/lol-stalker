import isDev from "electron-is-dev";
import path from "path";
import fs from "fs/promises";
import sqlite3 from "sqlite3";

import { createConnection } from "typeorm";
import { app } from "electron";
const dbFolder = path.join(app.getPath("userData"), "database");
const dbUrl = path.join(dbFolder, isDev ? "lol-stalker.dev.db" : "lol-stalker.db");

export const makeDb = async () => {
    try {
        await fs.stat(dbFolder);
    } catch (e) {
        await fs.mkdir(dbFolder);
    }
    try {
        await fs.stat(dbUrl);
    } catch (e) {
        await createDbFile();
        console.log(`db file ${dbUrl} does not exist, creating it`);
    }

    return createConnection({
        type: "sqlite",
        database: dbUrl,
        entities: [path.join(__dirname, "entities/*")],
        migrationsRun: true,
        migrations: [path.join(__dirname, "migration/*")],
    });
};

const createDbFile = () =>
    new Promise((resolve, reject) => {
        new sqlite3.Database(dbUrl, (err) => (err ? reject(err) : resolve(true)));
    });
