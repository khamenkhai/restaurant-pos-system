import { createCategory, getCategoryById, getCategories, deleteCategory, updateCategory, seedCategoriesAndProducts } from "../controllers/category";
import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";

const categoryRoutes = Router();

// categoryRoutes.use(authMiddleware);

categoryRoutes.get("/categories", getCategories);
categoryRoutes.get("/categories/:id", getCategoryById);
categoryRoutes.post("/categories", createCategory);
categoryRoutes.put("/categories/:id", updateCategory);
categoryRoutes.delete("/categories/:id", deleteCategory);
categoryRoutes.post("/seedCategories", seedCategoriesAndProducts);

export default categoryRoutes;