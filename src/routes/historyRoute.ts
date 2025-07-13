// routes/orderHistory.routes.ts
import express from "express";

import authMiddleware from "../middlewares/authMiddleware";
import {
  getOrderHistory,
  getOrderHistoryByTable,
  getOrderHistoryById,
} from "../controllers/history";

const historyRoutes = express.Router();

historyRoutes.get("/histories", authMiddleware, getOrderHistory);
historyRoutes.get("/table/:tableId", authMiddleware, getOrderHistoryByTable);
historyRoutes.get("/:id", authMiddleware, getOrderHistoryById);

export default historyRoutes;
