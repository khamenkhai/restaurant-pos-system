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
productRoutes.post("/products", createProduct);
productRoutes.put("/products/:id", updateProduct);
productRoutes.delete("/products/:id", deleteProduct);

export default productRoutes;
