import { MikroORM } from "@mikro-orm/core";
import sqlite3 from "sqlite3";

export const db = new sqlite3.Database("lol-stalking.db");
