import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/response";
import { prismaClient } from "../utils/prismaClient";
import { startOfMonth, endOfMonth } from "date-fns";


export const createExpense = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const userId = Number(req.user?.id);

        const { title, amount, expense_category, note } = req.body;

        // ✅ Manual validation
        if (!title || typeof title !== "string" || title.trim().length === 0) {
            return res.status(400).json({ message: "Title is required and must be a non-empty string" });
        }

        if (amount === undefined || typeof amount !== "number" || amount <= 0) {
            return res.status(400).json({ message: "Amount is required and must be a positive number" });
        }

        if (!expense_category || typeof expense_category !== "string" || expense_category.trim().length === 0) {
            return res.status(400).json({ message: "Expense category is required and must be a non-empty string" });
        }

        if (note !== undefined && typeof note !== "string") {
            return res.status(400).json({ message: "Note must be a string if provided" });
        }

        const expense = await prismaClient.expense.create({
            data: {
                user_id: userId,
                title: title,
                amount: amount,
                category: expense_category,
            },
        });

        sendResponse(res, 200, "Expense created success!", expense);
    } catch (error: any) {
        console.error("!![createExpense] Error:", error);
        next(error);
    }
};

export const getExpenses = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await prismaClient.expense.findMany({});
        sendResponse(res, 200, "Expense fetch success!", data);
    } catch (error) {
        console.error("!![getExpenses] Error:", error);
        next(error);
    }
};

export const getExpenseById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const expenseId = req.params.id;
        const data = await prismaClient.expense.findUnique({
            where: {
                id: +expenseId,
            },
        });
        sendResponse(res, 200, "Expense fetch success!", data);
    } catch (error) {
        console.error("!![getExpenseById] Error:", error);
        next(error);
    }
};

export const updateExpense = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {
        const expenseId = Number(req.params.id);

        const { title, amount, expense_category, note } = req.body;

        const data: any = {};
        if (title !== undefined) data.title = title;
        if (amount !== undefined) data.amount = amount;
        if (expense_category !== undefined) data.category = expense_category;
        if (note !== undefined) data.note = note;

        const updatedExpense = await prismaClient.expense.update({
            where: { id: expenseId },
            data,
        });

        sendResponse(res, 200, "Expense data updated successfully!", updatedExpense);
    } catch (error: any) {
        console.error("!![updateExpense] Error:", error);
        next(error);
    }
};

export const deleteExpense = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const expenseId = Number(req.params.id);

        await prismaClient.expense.update({
            where: { id: expenseId },
            data: {
                // is_deleted: true,
            }
        });


        sendResponse(res, 200, "Expense deleted successfully!", null);

    } catch (error: any) {
        console.error("!![deleteExpense] Error:", error);
        next(error);
    }
};


export const getCurrentMonthTotalExpense = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = Number(req.user?.id);

        const startDate = startOfMonth(new Date());
        const endDate = endOfMonth(new Date());

        const total = await prismaClient.expense.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                user_id: userId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        sendResponse(res, 200, "Current month total expense fetched!", {
            total: total._sum.amount || 0,
        });
    } catch (error) {
        console.error("!![getCurrentMonthTotalExpense] Error:", error);
        next(error);
    }
};
