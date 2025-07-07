// routes/orderHistory.routes.ts
import express from "express";

import authMiddleware from "../middlewares/authMiddleware";
import {
  getOrderHistory,
  getOrderHistoryByTable,
  getOrderHistoryById,
} from "../controllers/history";

const router = express.Router();

router.get("/", authMiddleware, getOrderHistory);
router.get("/table/:tableId", authMiddleware, getOrderHistoryByTable);
router.get("/:id", authMiddleware, getOrderHistoryById);

export default router;
