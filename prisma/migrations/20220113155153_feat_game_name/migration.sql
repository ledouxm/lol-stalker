-- CreateTable
CREATE TABLE "FriendName" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "puuid" TEXT NOT NULL,
    CONSTRAINT "FriendName_puuid_fkey" FOREIGN KEY ("puuid") REFERENCES "Friend" ("puuid") ON DELETE RESTRICT ON UPDATE CASCADE
);