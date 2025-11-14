-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PlayerStats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "totalMinigameWins" INTEGER NOT NULL DEFAULT 0,
    "totalTimePlayedSeconds" INTEGER NOT NULL DEFAULT 0,
    "totalLobbyWins" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PlayerStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Lobby" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lobbyCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hostPlayerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "settings" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerStats_playerId_key" ON "PlayerStats"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "Lobby_lobbyCode_key" ON "Lobby"("lobbyCode");
