/*
  Warnings:

  - You are about to drop the column `expire_data` on the `Block` table. All the data in the column will be lost.
  - Added the required column `expire_date` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hex` to the `Color` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flag_url` to the `Language` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_model_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_otp_id_fkey";

-- DropIndex
DROP INDEX "Address_user_id_idx";

-- DropIndex
DROP INDEX "Admin_lang_id_idx";

-- DropIndex
DROP INDEX "Block_admin_id_idx";

-- DropIndex
DROP INDEX "Block_user_id_idx";

-- DropIndex
DROP INDEX "Comment_product_id_idx";

-- DropIndex
DROP INDEX "Comment_user_id_idx";

-- DropIndex
DROP INDEX "Email_user_id_idx";

-- DropIndex
DROP INDEX "FavouriteItem_product_id_idx";

-- DropIndex
DROP INDEX "FavouriteItem_user_id_idx";

-- DropIndex
DROP INDEX "Model_brand_id_idx";

-- DropIndex
DROP INDEX "Payment_payment_method_id_idx";

-- DropIndex
DROP INDEX "Payment_user_id_idx";

-- DropIndex
DROP INDEX "Phone_user_id_idx";

-- DropIndex
DROP INDEX "Product_address_id_idx";

-- DropIndex
DROP INDEX "Product_admin_id_idx";

-- DropIndex
DROP INDEX "Product_brand_id_idx";

-- DropIndex
DROP INDEX "Product_color_id_idx";

-- DropIndex
DROP INDEX "Product_currency_id_idx";

-- DropIndex
DROP INDEX "Product_model_id_idx";

-- DropIndex
DROP INDEX "Product_phone_id_idx";

-- DropIndex
DROP INDEX "Product_user_id_idx";

-- DropIndex
DROP INDEX "ProductImage_product_id_idx";

-- DropIndex
DROP INDEX "User_currency_idx";

-- DropIndex
DROP INDEX "User_lang_id_idx";

-- DropIndex
DROP INDEX "User_otp_id_idx";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "lat" SET DATA TYPE TEXT,
ALTER COLUMN "long" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "surname" SET DATA TYPE TEXT,
ALTER COLUMN "birth_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "phone" SET DATA TYPE TEXT,
ALTER COLUMN "password" SET DATA TYPE TEXT,
ALTER COLUMN "avatar" DROP NOT NULL,
ALTER COLUMN "avatar" SET DATA TYPE TEXT,
ALTER COLUMN "refresh_token" DROP NOT NULL,
ALTER COLUMN "refresh_token" SET DATA TYPE TEXT,
ALTER COLUMN "lang_id" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "Block" DROP COLUMN "expire_data",
ADD COLUMN     "expire_date" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "reason" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Brand" ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "logo" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Color" ADD COLUMN     "hex" TEXT NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "text" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Currency" ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "symbol" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Email" ALTER COLUMN "email" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Language" ADD COLUMN     "flag_url" TEXT NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Model" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "OTP" ALTER COLUMN "uuid" SET DATA TYPE TEXT,
ALTER COLUMN "otp" SET DATA TYPE INTEGER,
ALTER COLUMN "expire" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PaymentMethod" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Phone" ALTER COLUMN "phone" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "title" SET DATA TYPE TEXT,
ALTER COLUMN "description" SET DATA TYPE TEXT,
ALTER COLUMN "year" SET DATA TYPE INTEGER,
ALTER COLUMN "brand_id" DROP NOT NULL,
ALTER COLUMN "model_id" DROP NOT NULL,
ALTER COLUMN "custom_model" DROP NOT NULL,
ALTER COLUMN "custom_model" SET DATA TYPE TEXT,
ALTER COLUMN "floor_price" SET DEFAULT true,
ALTER COLUMN "currency_id" SET DEFAULT 1,
ALTER COLUMN "admin_id" DROP NOT NULL,
ALTER COLUMN "top_expire_date" DROP NOT NULL,
ALTER COLUMN "top_expire_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ProductImage" ALTER COLUMN "url" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "surname" SET DATA TYPE TEXT,
ALTER COLUMN "birth_date" DROP NOT NULL,
ALTER COLUMN "birth_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "phone" SET DATA TYPE TEXT,
ALTER COLUMN "avatar" DROP NOT NULL,
ALTER COLUMN "avatar" SET DATA TYPE TEXT,
ALTER COLUMN "refresh_token" DROP NOT NULL,
ALTER COLUMN "refresh_token" SET DATA TYPE TEXT,
ALTER COLUMN "balance" SET DEFAULT 0,
ALTER COLUMN "otp_id" DROP NOT NULL,
ALTER COLUMN "lang_id" SET DEFAULT 1;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_otp_id_fkey" FOREIGN KEY ("otp_id") REFERENCES "OTP"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "Model"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
