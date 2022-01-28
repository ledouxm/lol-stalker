/*
  Warnings:

  - You are about to drop the column `selected` on the `Friend` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Friend" (
    "puuid" TEXT NOT NULL PRIMARY KEY,
    "id" TEXT,
    "gameName" TEXT NOT NULL,
    "gameTag" TEXT,
    "groupId" INTEGER NOT NULL DEFAULT 0,
    "groupName" TEXT NOT NULL DEFAULT 'NONE',
    "name" TEXT NOT NULL,
    "summonerId" INTEGER NOT NULL,
    "icon" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCurrentSummoner" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Friend" ("createdAt", "gameName", "gameTag", "groupId", "groupName", "icon", "id", "isCurrentSummoner", "name", "puuid", "summonerId") SELECT "createdAt", "gameName", "gameTag", "groupId", "groupName", "icon", "id", "isCurrentSummoner", "name", "puuid", "summonerId" FROM "Friend";
DROP TABLE "Friend";
ALTER TABLE "new_Friend" RENAME TO "Friend";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
