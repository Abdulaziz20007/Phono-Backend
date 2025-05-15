CREATE TABLE `User`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `surname` VARCHAR(255) NOT NULL,
    `birth_date` DATE NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `avatar` VARCHAR(255) NOT NULL,
    `refresh_token` VARCHAR(255) NOT NULL,
    `balance` FLOAT(53) NOT NULL,
    `otp_id` BIGINT NOT NULL,
    `lang_id` BIGINT NOT NULL,
    `currency` BIGINT NOT NULL
);
CREATE TABLE `OTP`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `uuid` VARCHAR(255) NOT NULL,
    `otp` TINYINT NOT NULL,
    `expire` DATE NOT NULL
);
CREATE TABLE `Phone`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `phone` VARCHAR(255) NOT NULL,
    `user_id` BIGINT NOT NULL
);
CREATE TABLE `Email`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL,
    `user_id` BIGINT NOT NULL
);
CREATE TABLE `Address`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `address` BIGINT NOT NULL,
    `lat` VARCHAR(255) NOT NULL,
    `long` VARCHAR(255) NOT NULL,
    `user_id` BIGINT NOT NULL,
    `is_active` BOOLEAN NOT NULL
);
CREATE TABLE `Language`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);
CREATE TABLE `Favourite Item`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `product_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL
);
CREATE TABLE `Product`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `year` TINYINT NOT NULL,
    `brand_id` BIGINT NOT NULL,
    `model_id` BIGINT NOT NULL,
    `custom_model` VARCHAR(255) NOT NULL,
    `color_id` BIGINT NOT NULL,
    `price` FLOAT(53) NOT NULL,
    `floor_price` BOOLEAN NOT NULL,
    `currency_id` BIGINT NOT NULL,
    `is_new` BOOLEAN NOT NULL,
    `has_document` BOOLEAN NOT NULL,
    `address_id` BIGINT NOT NULL,
    `phone_id` BIGINT NOT NULL,
    `storage` BIGINT NOT NULL,
    `ram` BIGINT NOT NULL,
    `views` BIGINT NOT NULL,
    `is_archived` BOOLEAN NOT NULL,
    `is_sold` BOOLEAN NOT NULL,
    `is_checked` BOOLEAN NOT NULL,
    `admin_id` BIGINT NOT NULL,
    `is_top` BOOLEAN NOT NULL,
    `top_expire_date` DATE NOT NULL
);
CREATE TABLE `Product Image`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `url` VARCHAR(255) NOT NULL,
    `product_id` BIGINT NOT NULL,
    `is_main` BOOLEAN NOT NULL
);
CREATE TABLE `Brand`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `logo` VARCHAR(255) NOT NULL
);
CREATE TABLE `Model`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `brand_id` BIGINT NOT NULL
);
CREATE TABLE `Color`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);
CREATE TABLE `Currency`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `symbol` VARCHAR(255) NOT NULL
);
CREATE TABLE `Admin`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `surname` VARCHAR(255) NOT NULL,
    `birth_date` DATE NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `avatar` VARCHAR(255) NOT NULL,
    `refresh_token` VARCHAR(255) NOT NULL,
    `lang_id` BIGINT NOT NULL,
    `is_creator` BOOLEAN NOT NULL
);
CREATE TABLE `Blocks`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `admin_id` BIGINT NOT NULL,
    `reason` VARCHAR(255) NOT NULL,
    `expire_data` DATE NOT NULL
);
CREATE TABLE `Payment`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `amount` FLOAT(53) NOT NULL,
    `payment_method_id` BIGINT NOT NULL
);
CREATE TABLE `Comment`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `text` VARCHAR(255) NOT NULL
);
CREATE TABLE `Payment Method`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);
ALTER TABLE
    `User` ADD CONSTRAINT `user_otp_id_foreign` FOREIGN KEY(`otp_id`) REFERENCES `OTP`(`id`);
ALTER TABLE
    `Email` ADD CONSTRAINT `email_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `User`(`id`);
ALTER TABLE
    `Phone` ADD CONSTRAINT `phone_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `User`(`id`);
ALTER TABLE
    `Favourite Item` ADD CONSTRAINT `favourite item_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `User`(`id`);
ALTER TABLE
    `User` ADD CONSTRAINT `user_lang_id_foreign` FOREIGN KEY(`lang_id`) REFERENCES `Language`(`id`);
ALTER TABLE
    `Favourite Item` ADD CONSTRAINT `favourite item_product_id_foreign` FOREIGN KEY(`product_id`) REFERENCES `Product`(`id`);
ALTER TABLE
    `Comment` ADD CONSTRAINT `comment_product_id_foreign` FOREIGN KEY(`product_id`) REFERENCES `Product`(`id`);
ALTER TABLE
    `Blocks` ADD CONSTRAINT `blocks_admin_id_foreign` FOREIGN KEY(`admin_id`) REFERENCES `Admin`(`id`);
ALTER TABLE
    `Address` ADD CONSTRAINT `address_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `User`(`id`);
ALTER TABLE
    `Product` ADD CONSTRAINT `product_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `User`(`id`);
ALTER TABLE
    `Comment` ADD CONSTRAINT `comment_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `User`(`id`);
ALTER TABLE
    `Payment` ADD CONSTRAINT `payment_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `User`(`id`);
ALTER TABLE
    `Model` ADD CONSTRAINT `model_brand_id_foreign` FOREIGN KEY(`brand_id`) REFERENCES `Brand`(`id`);
ALTER TABLE
    `Product` ADD CONSTRAINT `product_model_id_foreign` FOREIGN KEY(`model_id`) REFERENCES `Model`(`id`);
ALTER TABLE
    `Product` ADD CONSTRAINT `product_color_id_foreign` FOREIGN KEY(`color_id`) REFERENCES `Color`(`id`);
ALTER TABLE
    `Payment` ADD CONSTRAINT `payment_payment_method_id_foreign` FOREIGN KEY(`payment_method_id`) REFERENCES `Payment Method`(`id`);
ALTER TABLE
    `Product` ADD CONSTRAINT `product_address_id_foreign` FOREIGN KEY(`address_id`) REFERENCES `Address`(`id`);
ALTER TABLE
    `Product Image` ADD CONSTRAINT `product image_product_id_foreign` FOREIGN KEY(`product_id`) REFERENCES `Product`(`id`);
ALTER TABLE
    `Product` ADD CONSTRAINT `product_phone_id_foreign` FOREIGN KEY(`phone_id`) REFERENCES `Phone`(`id`);
ALTER TABLE
    `Admin` ADD CONSTRAINT `admin_lang_id_foreign` FOREIGN KEY(`lang_id`) REFERENCES `Language`(`id`);
ALTER TABLE
    `Product` ADD CONSTRAINT `product_currency_id_foreign` FOREIGN KEY(`currency_id`) REFERENCES `Currency`(`id`);
ALTER TABLE
    `Blocks` ADD CONSTRAINT `blocks_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `User`(`id`);
ALTER TABLE
    `Product` ADD CONSTRAINT `product_admin_id_foreign` FOREIGN KEY(`admin_id`) REFERENCES `Admin`(`id`);
ALTER TABLE
    `Product` ADD CONSTRAINT `product_brand_id_foreign` FOREIGN KEY(`brand_id`) REFERENCES `Brand`(`id`);