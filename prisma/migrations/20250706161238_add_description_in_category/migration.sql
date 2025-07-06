-- DropIndex
DROP INDEX `categories_name_key` ON `categories`;

-- AlterTable
ALTER TABLE `categories` ADD COLUMN `description` VARCHAR(191) NOT NULL DEFAULT '';
