/*
  Warnings:

  - You are about to drop the column `otp_id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `OTP` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `OTP` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_otp_id_fkey";

-- AlterTable
ALTER TABLE "OTP" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "otp" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "otp_id";

-- CreateIndex
CREATE UNIQUE INDEX "OTP_uuid_key" ON "OTP"("uuid");

-- AddForeignKey
ALTER TABLE "OTP" ADD CONSTRAINT "OTP_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
