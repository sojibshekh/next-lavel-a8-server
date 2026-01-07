/*
  Warnings:

  - You are about to drop the column `currency` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `plan` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `tranId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subscriptionId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');

-- DropIndex
DROP INDEX "Payment_tranId_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "currency",
DROP COLUMN "plan",
DROP COLUMN "tranId",
DROP COLUMN "updatedAt",
ADD COLUMN     "invoiceUrl" TEXT,
ADD COLUMN     "paymentGatewayData" JSONB,
ADD COLUMN     "subscriptionId" TEXT NOT NULL,
ADD COLUMN     "transactionId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");
