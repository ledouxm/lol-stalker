const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

console.log(path.join(__dirname, "electron/migration/*.js"));
module.exports = {
    type: "sqlite",
    database: path.join(process.env.APPDATA, "LoL Stalker", "database", "lol-stalker.dev.db"),
    migrations: [path.join(__dirname, "electron/migration/*.js")],
    entities: [path.join(__dirname, "main/entities/*.js")],
    cli: {
        migrationsDir: "electron/migration",
    },
};
