/*
  Warnings:

  - You are about to drop the column `productId` on the `product_variants` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `product_variants` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `product_variants` DROP FOREIGN KEY `product_variants_productId_fkey`;

-- DropIndex
DROP INDEX `product_variants_productId_fkey` ON `product_variants`;

-- AlterTable
ALTER TABLE `product_variants` DROP COLUMN `productId`,
    ADD COLUMN `product_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `product_variants` ADD CONSTRAINT `product_variants_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
