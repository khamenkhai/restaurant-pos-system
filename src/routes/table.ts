import { get } from "http";

import { Router } from "express";
import { createTable, deleteTable, getAllTables, getTableById, updateTable } from "../controllers/tables";

const tableRoutes = Router();

tableRoutes.get("/tables", getAllTables);
tableRoutes.get("/tables/:id", getTableById);
tableRoutes.post("/tables", createTable);
tableRoutes.put("/tables/:id", updateTable);
tableRoutes.delete("/tables/:id", deleteTable);

export default tableRoutes;
