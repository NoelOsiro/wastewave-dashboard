-- CreateTable
CREATE TABLE "Revenue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "month" TEXT NOT NULL,
    "revenue" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day" TEXT NOT NULL,
    "completed" INTEGER NOT NULL,
    "pending" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Performer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "generatorId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "wasteSeparation" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Performer_generatorId_fkey" FOREIGN KEY ("generatorId") REFERENCES "Generator" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
