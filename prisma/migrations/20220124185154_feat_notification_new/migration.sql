-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Notification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL DEFAULT '',
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "puuid" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isNew" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Notification_puuid_fkey" FOREIGN KEY ("puuid") REFERENCES "Friend" ("puuid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Notification" ("content", "createdAt", "from", "id", "puuid", "to", "type") SELECT "content", "createdAt", "from", "id", "puuid", "to", "type" FROM "Notification";
DROP TABLE "Notification";
ALTER TABLE "new_Notification" RENAME TO "Notification";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
