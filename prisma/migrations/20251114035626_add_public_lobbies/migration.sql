-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lobby" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lobbyCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hostPlayerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "settings" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "playerCount" INTEGER NOT NULL DEFAULT 0,
    "maxPlayers" INTEGER NOT NULL DEFAULT 16
);
INSERT INTO "new_Lobby" ("createdAt", "hostPlayerId", "id", "lobbyCode", "name", "settings", "status") SELECT "createdAt", "hostPlayerId", "id", "lobbyCode", "name", "settings", "status" FROM "Lobby";
DROP TABLE "Lobby";
ALTER TABLE "new_Lobby" RENAME TO "Lobby";
CREATE UNIQUE INDEX "Lobby_lobbyCode_key" ON "Lobby"("lobbyCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
