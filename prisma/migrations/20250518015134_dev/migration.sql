/*
  Warnings:

  - You are about to drop the `OTP` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OTP" DROP CONSTRAINT "OTP_user_id_fkey";

-- DropTable
DROP TABLE "OTP";

-- CreateTable
CREATE TABLE "Otp" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "uuid" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Otp_uuid_key" ON "Otp"("uuid");

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
