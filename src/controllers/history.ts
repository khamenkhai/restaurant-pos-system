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

export const searchHistoryByUuid = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { uuid } = req.params;

    if (!uuid || typeof uuid !== "string") {
      return res.status(400).json({ message: "Invalid UUID" });
    }

    const order = await prismaClient.order.findMany({
      where: {
        uuid: {
          contains: uuid,
          mode: "insensitive",
        },
        status: {
          in: ["completed", "cancelled"],
        },
      },
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

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or not completed/cancelled" });
    }

    sendResponse(
      res,
      200,
      "Order history by UUID fetched successfully!",
      order
    );
  } catch (error) {
    console.error("[getOrderHistoryByUUID] Error:", error);
    next(error);
  }
};
