-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL,
    "consumer_key" TEXT NOT NULL,
    "consumer_secret" TEXT NOT NULL,
    "initiator_name" TEXT NOT NULL,
    "security_credential" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_provider_key" ON "ApiKey"("provider");
