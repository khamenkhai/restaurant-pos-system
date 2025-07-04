-- DropForeignKey
ALTER TABLE `order_items` DROP FOREIGN KEY `order_items_variant_id_fkey`;

-- DropIndex
DROP INDEX `order_items_variant_id_fkey` ON `order_items`;

-- AlterTable
ALTER TABLE `order_items` MODIFY `variant_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_variant_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
