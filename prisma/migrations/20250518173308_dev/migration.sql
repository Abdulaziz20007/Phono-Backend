/*
  Warnings:

  - Made the column `balance` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `currency_id` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_currency_id_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "balance" SET NOT NULL,
ALTER COLUMN "currency_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
