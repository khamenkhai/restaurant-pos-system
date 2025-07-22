-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "payment_methods" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "tables" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;
