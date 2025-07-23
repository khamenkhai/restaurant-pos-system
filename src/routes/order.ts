import {
  getOrders,
  getOrderById,
  createOrder,
  addMoreProductsToOrder,
  deleteOrder,
  checkoutOrder,
  cancelOrder,
} from "../controllers/order";
import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";

const orderRoutes = Router();

orderRoutes.get("/orders", authMiddleware, getOrders);
orderRoutes.get("/orders/:id", getOrderById);
orderRoutes.post("/orders", authMiddleware, createOrder);
orderRoutes.post("/orders/checkout/:id", authMiddleware, checkoutOrder);
orderRoutes.post("/orders/cancel/:id", authMiddleware, cancelOrder);
orderRoutes.put("/orders/:id", authMiddleware, addMoreProductsToOrder);
orderRoutes.delete("/orders/:id", deleteOrder);

export default orderRoutes;
