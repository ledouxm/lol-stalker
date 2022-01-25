-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Friend" (
    "puuid" TEXT NOT NULL PRIMARY KEY,
    "id" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,
    "gameTag" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL DEFAULT 0,
    "groupName" TEXT NOT NULL DEFAULT 'NONE',
    "name" TEXT NOT NULL,
    "summonerId" INTEGER NOT NULL,
    "icon" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "selected" BOOLEAN NOT NULL DEFAULT true,
    "isCurrentSummoner" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Friend" ("createdAt", "gameName", "gameTag", "groupId", "groupName", "icon", "id", "name", "puuid", "selected", "summonerId") SELECT "createdAt", "gameName", "gameTag", "groupId", "groupName", "icon", "id", "name", "puuid", "selected", "summonerId" FROM "Friend";
DROP TABLE "Friend";
ALTER TABLE "new_Friend" RENAME TO "Friend";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
