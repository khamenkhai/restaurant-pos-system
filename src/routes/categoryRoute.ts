import { get } from "http";
import { createCategory, getCategoryById, getCategories, deleteCategory, updateCategory } from "../controllers/category";
import { Router } from "express";

const categoryRoutes = Router();

categoryRoutes.get("/categories", getCategories);
categoryRoutes.get("/categories/:id", getCategoryById);
categoryRoutes.post("/categories", createCategory);
categoryRoutes.put("/categories/:id", updateCategory);
categoryRoutes.delete("/categories/:id", deleteCategory);

export default categoryRoutes;