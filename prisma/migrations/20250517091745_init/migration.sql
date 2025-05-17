-- CreateTable
CREATE TABLE "Generator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    CONSTRAINT "Generator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Collector" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "vehicle" TEXT NOT NULL,
    CONSTRAINT "Collector_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WasteType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RecyclingCenter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    CONSTRAINT "RecyclingCenter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CollectionRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "generatorId" TEXT NOT NULL,
    "wasteType" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "requestedTime" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "collectorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CollectionRequest_generatorId_fkey" FOREIGN KEY ("generatorId") REFERENCES "Generator" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CollectionRequest_collectorId_fkey" FOREIGN KEY ("collectorId") REFERENCES "Collector" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WasteTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "collectionRequestId" TEXT NOT NULL,
    "collectorId" TEXT NOT NULL,
    "recyclingCenterId" TEXT NOT NULL,
    "wasteType" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "collectionTime" DATETIME NOT NULL,
    "deliveryTime" DATETIME,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WasteTransaction_collectionRequestId_fkey" FOREIGN KEY ("collectionRequestId") REFERENCES "CollectionRequest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WasteTransaction_collectorId_fkey" FOREIGN KEY ("collectorId") REFERENCES "Collector" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WasteTransaction_recyclingCenterId_fkey" FOREIGN KEY ("recyclingCenterId") REFERENCES "RecyclingCenter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WasteReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "periodStart" DATETIME NOT NULL,
    "periodEnd" DATETIME NOT NULL,
    "totalWaste" REAL NOT NULL,
    "wasteByType" JSONB NOT NULL,
    "complianceStatus" TEXT NOT NULL,
    "generatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MpesaTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mpesaTransactionId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "transactionDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "collectionRequestId" TEXT NOT NULL,
    "payerId" TEXT NOT NULL,
    "payeeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MpesaTransaction_collectionRequestId_fkey" FOREIGN KEY ("collectionRequestId") REFERENCES "CollectionRequest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MpesaTransaction_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MpesaTransaction_payeeId_fkey" FOREIGN KEY ("payeeId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_AcceptedWasteTypes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_AcceptedWasteTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "RecyclingCenter" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AcceptedWasteTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "WasteType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Generator_userId_key" ON "Generator"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Collector_userId_key" ON "Collector"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WasteType_name_key" ON "WasteType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RecyclingCenter_userId_key" ON "RecyclingCenter"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MpesaTransaction_mpesaTransactionId_key" ON "MpesaTransaction"("mpesaTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "_AcceptedWasteTypes_AB_unique" ON "_AcceptedWasteTypes"("A", "B");

-- CreateIndex
CREATE INDEX "_AcceptedWasteTypes_B_index" ON "_AcceptedWasteTypes"("B");
