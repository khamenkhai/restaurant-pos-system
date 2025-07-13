/*
  Warnings:

  - The values [preparing] on the enum `orders_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `orders` MODIFY `status` ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `tables` ADD COLUMN `status` ENUM('available', 'unavailable') NOT NULL DEFAULT 'available';
