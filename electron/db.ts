import sqlite3 from "sqlite3";
import { PrismaClient } from "./prismaClient";

export const db = new sqlite3.Database("lol-stalking.db");

export const prisma = new PrismaClient({
    // log: ["query", "info", "warn", "error"],
});
