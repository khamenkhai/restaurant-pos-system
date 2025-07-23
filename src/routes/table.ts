import { Router } from "express";
import { createTable, deleteTable, getAllTables, getTableById, seedTables, updateTable } from "../controllers/tables";
import authMiddleware from "../middlewares/authMiddleware";

const tableRoutes = Router();

tableRoutes.get("/tables", authMiddleware, getAllTables);
tableRoutes.get("/tables/:id", getTableById);
tableRoutes.post("/tables", authMiddleware, createTable);
tableRoutes.put("/tables/:id",authMiddleware, updateTable);
tableRoutes.delete("/tables/:id", authMiddleware, deleteTable);
tableRoutes.post("/seedTables", seedTables);

export default tableRoutes;
