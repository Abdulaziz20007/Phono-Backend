-- AlterTable
ALTER TABLE "Email" ADD COLUMN     "activation" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT false;
