import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { createExpense, deleteExpense, getCurrentMonthTotalExpense, getExpenseById, getExpenses, updateExpense } from "../controllers/expense";

const expenseRoutes = Router();

expenseRoutes.get("/expense", getExpenses);
expenseRoutes.get("/expense/:id", getExpenseById);
expenseRoutes.post("/expense", authMiddleware, createExpense);
expenseRoutes.put("/expense/:id", updateExpense);
expenseRoutes.delete("/expense/:id", deleteExpense);
expenseRoutes.get("/current-month-expense", authMiddleware, getCurrentMonthTotalExpense);

export default expenseRoutes;