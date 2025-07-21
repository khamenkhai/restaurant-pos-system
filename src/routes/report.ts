import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { getMonthlySalesReport, getSalesReport } from "../controllers/report";

const reportRoutes = express.Router();

// GET /api/reports?type=daily | weekly | monthly
reportRoutes.get("/reports", authMiddleware, getSalesReport);
reportRoutes.get("/monthly-reports", authMiddleware, getMonthlySalesReport);

export default reportRoutes;
