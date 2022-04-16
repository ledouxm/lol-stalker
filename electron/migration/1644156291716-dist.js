const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class dist1644156291716 {
    name = 'dist1644156291716'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "temporary_Friend" ("puuid" text PRIMARY KEY NOT NULL, "id" text, "gameName" text NOT NULL, "gameTag" text, "groupId" integer NOT NULL DEFAULT (0), "groupName" text NOT NULL DEFAULT ('NONE'), "name" text NOT NULL, "summonerId" integer NOT NULL, "icon" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "isCurrentSummoner" boolean NOT NULL DEFAULT (false), "subscription" text)`);
        await queryRunner.query(`INSERT INTO "temporary_Friend"("puuid", "id", "gameName", "gameTag", "groupId", "groupName", "name", "summonerId", "icon", "createdAt", "isCurrentSummoner") SELECT "puuid", "id", "gameName", "gameTag", "groupId", "groupName", "name", "summonerId", "icon", "createdAt", "isCurrentSummoner" FROM "Friend"`);
        await queryRunner.query(`DROP TABLE "Friend"`);
        await queryRunner.query(`ALTER TABLE "temporary_Friend" RENAME TO "Friend"`);
        await queryRunner.query(`CREATE TABLE "temporary_Ranking" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "division" text NOT NULL, "tier" text NOT NULL, "leaguePoints" integer NOT NULL, "wins" integer NOT NULL, "losses" integer NOT NULL, "miniSeriesProgress" text NOT NULL DEFAULT (''), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "puuid" text)`);
        await queryRunner.query(`INSERT INTO "temporary_Ranking"("id", "division", "tier", "leaguePoints", "wins", "losses", "miniSeriesProgress", "createdAt", "puuid") SELECT "id", "division", "tier", "leaguePoints", "wins", "losses", "miniSeriesProgress", "createdAt", "puuid" FROM "Ranking"`);
        await queryRunner.query(`DROP TABLE "Ranking"`);
        await queryRunner.query(`ALTER TABLE "temporary_Ranking" RENAME TO "Ranking"`);
        await queryRunner.query(`CREATE TABLE "temporary_FriendName" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL DEFAULT (''), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "puuid" text)`);
        await queryRunner.query(`INSERT INTO "temporary_FriendName"("id", "name", "createdAt", "puuid") SELECT "id", "name", "createdAt", "puuid" FROM "FriendName"`);
        await queryRunner.query(`DROP TABLE "FriendName"`);
        await queryRunner.query(`ALTER TABLE "temporary_FriendName" RENAME TO "FriendName"`);
        await queryRunner.query(`CREATE TABLE "temporary_Notification" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" text NOT NULL DEFAULT (''), "from" text NOT NULL, "to" text NOT NULL, "content" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "isNew" boolean NOT NULL DEFAULT (true), "puuid" text)`);
        await queryRunner.query(`INSERT INTO "temporary_Notification"("id", "type", "from", "to", "content", "createdAt", "isNew", "puuid") SELECT "id", "type", "from", "to", "content", "createdAt", "isNew", "puuid" FROM "Notification"`);
        await queryRunner.query(`DROP TABLE "Notification"`);
        await queryRunner.query(`ALTER TABLE "temporary_Notification" RENAME TO "Notification"`);
        await queryRunner.query(`CREATE TABLE "temporary_Friend" ("puuid" text PRIMARY KEY NOT NULL, "id" text, "gameName" text NOT NULL, "gameTag" text, "groupId" integer NOT NULL DEFAULT (0), "groupName" text NOT NULL DEFAULT ('NONE'), "name" text NOT NULL, "summonerId" integer NOT NULL, "icon" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "isCurrentSummoner" boolean NOT NULL DEFAULT (false), "subscription" text, CONSTRAINT "UQ_e9500c8aa0065f96b5e95502506" UNIQUE ("puuid"))`);
        await queryRunner.query(`INSERT INTO "temporary_Friend"("puuid", "id", "gameName", "gameTag", "groupId", "groupName", "name", "summonerId", "icon", "createdAt", "isCurrentSummoner", "subscription") SELECT "puuid", "id", "gameName", "gameTag", "groupId", "groupName", "name", "summonerId", "icon", "createdAt", "isCurrentSummoner", "subscription" FROM "Friend"`);
        await queryRunner.query(`DROP TABLE "Friend"`);
        await queryRunner.query(`ALTER TABLE "temporary_Friend" RENAME TO "Friend"`);
        await queryRunner.query(`CREATE TABLE "temporary_Ranking" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "division" text NOT NULL, "tier" text NOT NULL, "leaguePoints" integer NOT NULL, "wins" integer NOT NULL, "losses" integer NOT NULL, "miniSeriesProgress" text NOT NULL DEFAULT (''), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "puuid" text, CONSTRAINT "FK_07dd2b585b204c4f5d9f7e458bf" FOREIGN KEY ("puuid") REFERENCES "Friend" ("puuid") ON DELETE RESTRICT ON UPDATE CASCADE)`);
        await queryRunner.query(`INSERT INTO "temporary_Ranking"("id", "division", "tier", "leaguePoints", "wins", "losses", "miniSeriesProgress", "createdAt", "puuid") SELECT "id", "division", "tier", "leaguePoints", "wins", "losses", "miniSeriesProgress", "createdAt", "puuid" FROM "Ranking"`);
        await queryRunner.query(`DROP TABLE "Ranking"`);
        await queryRunner.query(`ALTER TABLE "temporary_Ranking" RENAME TO "Ranking"`);
        await queryRunner.query(`CREATE TABLE "temporary_FriendName" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL DEFAULT (''), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "puuid" text, CONSTRAINT "FK_0a11f58ef016f91c3917d0620bb" FOREIGN KEY ("puuid") REFERENCES "Friend" ("puuid") ON DELETE RESTRICT ON UPDATE CASCADE)`);
        await queryRunner.query(`INSERT INTO "temporary_FriendName"("id", "name", "createdAt", "puuid") SELECT "id", "name", "createdAt", "puuid" FROM "FriendName"`);
        await queryRunner.query(`DROP TABLE "FriendName"`);
        await queryRunner.query(`ALTER TABLE "temporary_FriendName" RENAME TO "FriendName"`);
        await queryRunner.query(`CREATE TABLE "temporary_Notification" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" text NOT NULL DEFAULT (''), "from" text NOT NULL, "to" text NOT NULL, "content" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "isNew" boolean NOT NULL DEFAULT (true), "puuid" text, CONSTRAINT "FK_a0f86a7dba20e7f0d9c708a65a5" FOREIGN KEY ("puuid") REFERENCES "Friend" ("puuid") ON DELETE RESTRICT ON UPDATE CASCADE)`);
        await queryRunner.query(`INSERT INTO "temporary_Notification"("id", "type", "from", "to", "content", "createdAt", "isNew", "puuid") SELECT "id", "type", "from", "to", "content", "createdAt", "isNew", "puuid" FROM "Notification"`);
        await queryRunner.query(`DROP TABLE "Notification"`);
        await queryRunner.query(`ALTER TABLE "temporary_Notification" RENAME TO "Notification"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "Notification" RENAME TO "temporary_Notification"`);
        await queryRunner.query(`CREATE TABLE "Notification" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" text NOT NULL DEFAULT (''), "from" text NOT NULL, "to" text NOT NULL, "content" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "isNew" boolean NOT NULL DEFAULT (true), "puuid" text)`);
        await queryRunner.query(`INSERT INTO "Notification"("id", "type", "from", "to", "content", "createdAt", "isNew", "puuid") SELECT "id", "type", "from", "to", "content", "createdAt", "isNew", "puuid" FROM "temporary_Notification"`);
        await queryRunner.query(`DROP TABLE "temporary_Notification"`);
        await queryRunner.query(`ALTER TABLE "FriendName" RENAME TO "temporary_FriendName"`);
        await queryRunner.query(`CREATE TABLE "FriendName" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL DEFAULT (''), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "puuid" text)`);
        await queryRunner.query(`INSERT INTO "FriendName"("id", "name", "createdAt", "puuid") SELECT "id", "name", "createdAt", "puuid" FROM "temporary_FriendName"`);
        await queryRunner.query(`DROP TABLE "temporary_FriendName"`);
        await queryRunner.query(`ALTER TABLE "Ranking" RENAME TO "temporary_Ranking"`);
        await queryRunner.query(`CREATE TABLE "Ranking" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "division" text NOT NULL, "tier" text NOT NULL, "leaguePoints" integer NOT NULL, "wins" integer NOT NULL, "losses" integer NOT NULL, "miniSeriesProgress" text NOT NULL DEFAULT (''), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "puuid" text)`);
        await queryRunner.query(`INSERT INTO "Ranking"("id", "division", "tier", "leaguePoints", "wins", "losses", "miniSeriesProgress", "createdAt", "puuid") SELECT "id", "division", "tier", "leaguePoints", "wins", "losses", "miniSeriesProgress", "createdAt", "puuid" FROM "temporary_Ranking"`);
        await queryRunner.query(`DROP TABLE "temporary_Ranking"`);
        await queryRunner.query(`ALTER TABLE "Friend" RENAME TO "temporary_Friend"`);
        await queryRunner.query(`CREATE TABLE "Friend" ("puuid" text PRIMARY KEY NOT NULL, "id" text, "gameName" text NOT NULL, "gameTag" text, "groupId" integer NOT NULL DEFAULT (0), "groupName" text NOT NULL DEFAULT ('NONE'), "name" text NOT NULL, "summonerId" integer NOT NULL, "icon" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "isCurrentSummoner" boolean NOT NULL DEFAULT (false), "subscription" text)`);
        await queryRunner.query(`INSERT INTO "Friend"("puuid", "id", "gameName", "gameTag", "groupId", "groupName", "name", "summonerId", "icon", "createdAt", "isCurrentSummoner", "subscription") SELECT "puuid", "id", "gameName", "gameTag", "groupId", "groupName", "name", "summonerId", "icon", "createdAt", "isCurrentSummoner", "subscription" FROM "temporary_Friend"`);
        await queryRunner.query(`DROP TABLE "temporary_Friend"`);
        await queryRunner.query(`ALTER TABLE "Notification" RENAME TO "temporary_Notification"`);
        await queryRunner.query(`CREATE TABLE "Notification" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" text NOT NULL DEFAULT (''), "from" text NOT NULL, "to" text NOT NULL, "content" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "isNew" boolean NOT NULL DEFAULT (true), "puuid" text, CONSTRAINT "FK_a0f86a7dba20e7f0d9c708a65a5" FOREIGN KEY ("puuid") REFERENCES "Friend" ("puuid") ON DELETE RESTRICT ON UPDATE CASCADE)`);
        await queryRunner.query(`INSERT INTO "Notification"("id", "type", "from", "to", "content", "createdAt", "isNew", "puuid") SELECT "id", "type", "from", "to", "content", "createdAt", "isNew", "puuid" FROM "temporary_Notification"`);
        await queryRunner.query(`DROP TABLE "temporary_Notification"`);
        await queryRunner.query(`ALTER TABLE "FriendName" RENAME TO "temporary_FriendName"`);
        await queryRunner.query(`CREATE TABLE "FriendName" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL DEFAULT (''), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "puuid" text, CONSTRAINT "FK_0a11f58ef016f91c3917d0620bb" FOREIGN KEY ("puuid") REFERENCES "Friend" ("puuid") ON DELETE RESTRICT ON UPDATE CASCADE)`);
        await queryRunner.query(`INSERT INTO "FriendName"("id", "name", "createdAt", "puuid") SELECT "id", "name", "createdAt", "puuid" FROM "temporary_FriendName"`);
        await queryRunner.query(`DROP TABLE "temporary_FriendName"`);
        await queryRunner.query(`ALTER TABLE "Ranking" RENAME TO "temporary_Ranking"`);
        await queryRunner.query(`CREATE TABLE "Ranking" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "division" text NOT NULL, "tier" text NOT NULL, "leaguePoints" integer NOT NULL, "wins" integer NOT NULL, "losses" integer NOT NULL, "miniSeriesProgress" text NOT NULL DEFAULT (''), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "puuid" text, CONSTRAINT "FK_07dd2b585b204c4f5d9f7e458bf" FOREIGN KEY ("puuid") REFERENCES "Friend" ("puuid") ON DELETE RESTRICT ON UPDATE CASCADE)`);
        await queryRunner.query(`INSERT INTO "Ranking"("id", "division", "tier", "leaguePoints", "wins", "losses", "miniSeriesProgress", "createdAt", "puuid") SELECT "id", "division", "tier", "leaguePoints", "wins", "losses", "miniSeriesProgress", "createdAt", "puuid" FROM "temporary_Ranking"`);
        await queryRunner.query(`DROP TABLE "temporary_Ranking"`);
        await queryRunner.query(`ALTER TABLE "Friend" RENAME TO "temporary_Friend"`);
        await queryRunner.query(`CREATE TABLE "Friend" ("puuid" text PRIMARY KEY NOT NULL, "id" text, "gameName" text NOT NULL, "gameTag" text, "groupId" integer NOT NULL DEFAULT (0), "groupName" text NOT NULL DEFAULT ('NONE'), "name" text NOT NULL, "summonerId" integer NOT NULL, "icon" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "isCurrentSummoner" boolean NOT NULL DEFAULT (false))`);
        await queryRunner.query(`INSERT INTO "Friend"("puuid", "id", "gameName", "gameTag", "groupId", "groupName", "name", "summonerId", "icon", "createdAt", "isCurrentSummoner") SELECT "puuid", "id", "gameName", "gameTag", "groupId", "groupName", "name", "summonerId", "icon", "createdAt", "isCurrentSummoner" FROM "temporary_Friend"`);
        await queryRunner.query(`DROP TABLE "temporary_Friend"`);
    }
}
