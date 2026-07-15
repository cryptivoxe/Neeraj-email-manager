/*
  Warnings:

  - You are about to drop the column `dueDate` on the `Email` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Email_dueDate_idx";

-- AlterTable
ALTER TABLE "Email" DROP COLUMN "dueDate",
ADD COLUMN     "closedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Email_closedAt_idx" ON "Email"("closedAt");
