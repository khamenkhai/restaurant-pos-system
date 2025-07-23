import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import {
  getOrderHistory,
  searchHistoryByUuid,
} from "../controllers/history";

const historyRoutes = express.Router();

historyRoutes.get("/histories", authMiddleware, getOrderHistory);
historyRoutes.get("/histories/:uuid", authMiddleware, searchHistoryByUuid);

export default historyRoutes;
