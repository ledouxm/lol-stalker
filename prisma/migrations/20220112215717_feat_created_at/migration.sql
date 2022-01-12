-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Friend" (
    "puuid" TEXT NOT NULL PRIMARY KEY,
    "id" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,
    "gameTag" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summonerId" INTEGER NOT NULL,
    "icon" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Friend" ("gameName", "gameTag", "icon", "id", "name", "puuid", "summonerId") SELECT "gameName", "gameTag", "icon", "id", "name", "puuid", "summonerId" FROM "Friend";
DROP TABLE "Friend";
ALTER TABLE "new_Friend" RENAME TO "Friend";
CREATE TABLE "new_Ranking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "division" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "leaguePoints" INTEGER NOT NULL,
    "wins" INTEGER NOT NULL,
    "losses" INTEGER NOT NULL,
    "puuid" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Ranking_puuid_fkey" FOREIGN KEY ("puuid") REFERENCES "Friend" ("puuid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ranking" ("division", "id", "leaguePoints", "losses", "puuid", "tier", "wins") SELECT "division", "id", "leaguePoints", "losses", "puuid", "tier", "wins" FROM "Ranking";
DROP TABLE "Ranking";
ALTER TABLE "new_Ranking" RENAME TO "Ranking";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
