import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { getSalesReport } from "../controllers/report";

const reportRoutes = express.Router();

// GET /api/reports?type=daily | weekly | monthly
reportRoutes.get("/reports", authMiddleware, getSalesReport);

export default reportRoutes;
