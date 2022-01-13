-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FriendName" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "puuid" TEXT NOT NULL,
    CONSTRAINT "FriendName_puuid_fkey" FOREIGN KEY ("puuid") REFERENCES "Friend" ("puuid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FriendName" ("createdAt", "id", "puuid") SELECT "createdAt", "id", "puuid" FROM "FriendName";
DROP TABLE "FriendName";
ALTER TABLE "new_FriendName" RENAME TO "FriendName";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
