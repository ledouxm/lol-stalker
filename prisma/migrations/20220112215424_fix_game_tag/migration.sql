/*
  Warnings:

  - You are about to drop the column `gameTa` on the `Friend` table. All the data in the column will be lost.
  - Added the required column `gameTag` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Friend" (
    "puuid" TEXT NOT NULL PRIMARY KEY,
    "id" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,
    "gameTag" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summonerId" INTEGER NOT NULL,
    "icon" INTEGER NOT NULL
);
INSERT INTO "new_Friend" ("gameName", "icon", "id", "name", "puuid", "summonerId") SELECT "gameName", "icon", "id", "name", "puuid", "summonerId" FROM "Friend";
DROP TABLE "Friend";
ALTER TABLE "new_Friend" RENAME TO "Friend";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
