import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/order";
import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";

const orderRoutes = Router();

// orderRoutes.use(authMiddleware);

orderRoutes.get("/orders", getOrders);
orderRoutes.get("/orders/:id", getOrderById);
orderRoutes.post("/orders", authMiddleware, createOrder);
orderRoutes.put("/orders/:id", updateOrder);
orderRoutes.delete("/orders/:id", deleteOrder);

export default orderRoutes;
