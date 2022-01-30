import isDev from "electron-is-dev";
import path from "path";
import sqlite3 from "sqlite3";
import { PrismaClient } from "./prismaClient";
const dbUrl = isDev ? "lol-stalking.db.dev" : "lol-stalking.db";
console.log(isDev);
export const db = new sqlite3.Database(dbUrl);

export const prisma = isDev
    ? new PrismaClient({
          datasources: {
              db: { url: `file://${path.join(__dirname, "../" + dbUrl).replace("C:\\", "")}` },
          },
          // log: ["query", "info", "warn", "error"],
      })
    : new PrismaClient();
