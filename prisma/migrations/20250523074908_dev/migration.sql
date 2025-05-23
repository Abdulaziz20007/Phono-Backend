/*
  Warnings:

  - You are about to drop the column `is_top` on the `Product` table. All the data in the column will be lost.
  - Made the column `top_expire_date` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "is_top",
ALTER COLUMN "top_expire_date" SET NOT NULL,
ALTER COLUMN "top_expire_date" SET DEFAULT CURRENT_TIMESTAMP;
