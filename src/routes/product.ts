import {
  createProduct,
  getProductById,
  getProducts,
  deleteProduct,
  updateProduct,
} from "../controllers/product";
import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";

const productRoutes = Router();

productRoutes.get("/products", getProducts);
productRoutes.get("/products/:id", getProductById);
productRoutes.post("/products", authMiddleware, createProduct);
productRoutes.put("/products/:id", authMiddleware, updateProduct);
productRoutes.delete("/products/:id", deleteProduct);

export default productRoutes;
