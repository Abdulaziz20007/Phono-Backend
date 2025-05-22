/*
  Warnings:

  - You are about to drop the column `is_creator` on the `Admin` table. All the data in the column will be lost.
  - Made the column `refresh_token` on table `Admin` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "is_creator",
ALTER COLUMN "refresh_token" SET NOT NULL;
