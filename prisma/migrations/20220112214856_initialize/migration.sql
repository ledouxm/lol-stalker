-- CreateTable
CREATE TABLE "Friend" (
    "puuid" TEXT NOT NULL PRIMARY KEY,
    "id" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,
    "gameTa" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summonerId" INTEGER NOT NULL,
    "icon" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Ranking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "division" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "leaguePoints" INTEGER NOT NULL,
    "wins" INTEGER NOT NULL,
    "losses" INTEGER NOT NULL,
    "puuid" TEXT NOT NULL,
    CONSTRAINT "Ranking_puuid_fkey" FOREIGN KEY ("puuid") REFERENCES "Friend" ("puuid") ON DELETE RESTRICT ON UPDATE CASCADE
);
