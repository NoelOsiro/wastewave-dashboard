/*
  Warnings:

  - Added the required column `updatedAt` to the `Generator` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Generator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Generator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Generator" ("address", "id", "userId") SELECT "address", "id", "userId" FROM "Generator";
DROP TABLE "Generator";
ALTER TABLE "new_Generator" RENAME TO "Generator";
CREATE UNIQUE INDEX "Generator_userId_key" ON "Generator"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
