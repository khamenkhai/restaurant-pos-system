import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import {
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
} from "../controllers/product-variant";

const productVariantRoutes = Router();

// ✅ Create a new variant for a product
productVariantRoutes.post(
  "/products/variant/:id",
  authMiddleware,
  createProductVariant
);

// ✅ Update a specific variant by ID
productVariantRoutes.put(
  "/variants/:variantId",
  authMiddleware,
  updateProductVariant
);

// ✅ Soft delete a specific variant by ID
productVariantRoutes.delete(
  "/variants/:variantId",
  authMiddleware,
  deleteProductVariant
);

export default productVariantRoutes;
