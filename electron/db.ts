import sqlite3 from "sqlite3";

export const db = new sqlite3.Database("lol-stalking.db");
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    // log: ["query", "info", "warn", "error"],
});
