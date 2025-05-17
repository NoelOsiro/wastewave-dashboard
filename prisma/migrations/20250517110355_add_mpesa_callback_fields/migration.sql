/*
  Warnings:

  - A unique constraint covering the columns `[checkoutRequestId]` on the table `MpesaTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MpesaTransaction" ADD COLUMN "checkoutRequestId" TEXT;
ALTER TABLE "MpesaTransaction" ADD COLUMN "mpesaReceiptNumber" TEXT;
ALTER TABLE "MpesaTransaction" ADD COLUMN "resultCode" INTEGER;
ALTER TABLE "MpesaTransaction" ADD COLUMN "resultDesc" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "MpesaTransaction_checkoutRequestId_key" ON "MpesaTransaction"("checkoutRequestId");
