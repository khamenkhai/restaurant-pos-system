import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../utils/prismaClient";
import { AppError } from "../utils/app-error";
import { sendResponse } from "../utils/response";
import { OrderStatus } from "../../generated/prisma";

// Get all completed/cancelled orders (history)
export const getOrderHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }
    const statusFilter = [OrderStatus.completed, OrderStatus.cancelled];

    const orders = await prismaClient.order.findMany({
      where: {
        user_id: userId,
        status: {
          in: statusFilter,
        },
      },
      include: {
        table: true,
        order_items: {
          include: {
            product: true,
            variant: true,
          },
        },
        buffet: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    sendResponse(res, 200, "Order history fetched successfully!", orders);
  } catch (error) {
    console.error("[getOrderHistory] Error:", error);
    next(error);
  }
};

// Get history by table
export const getOrderHistoryByTable = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tableId = Number(req.params.tableId);
    if (isNaN(tableId)) {
      res.status(400).json({ message: "Invalid table ID" });
    }

    const orders = await prismaClient.order.findMany({
      where: {
        table_id: tableId,
        status: {
          in: ["completed", "cancelled"],
        },
      },
      include: {
        user: true,
        order_items: {
          include: {
            product: true,
            variant: true,
          },
        },
        buffet: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    sendResponse(res, 200, "Table order history fetched successfully!", orders);
  } catch (error) {
    console.error("[getOrderHistoryByTable] Error:", error);
    next(error);
  }
};

// Get specific historical order
export const getOrderHistoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await prismaClient.order.findUnique({
      where: { id },
      include: {
        user: true,
        table: true,
        order_items: {
          include: {
            product: true,
            variant: true,
          },
        },
        buffet: true,
      },
    });

    if (!order || !["completed", "cancelled"].includes(order.status)) {
      res
        .status(404)
        .json({ message: "Order not found or not completed/cancelled" });
    }

    sendResponse(res, 200, "Historical order fetched successfully!", order);
  } catch (error) {
    console.error("[getOrderHistoryById] Error:", error);
    next(error);
  }
};
