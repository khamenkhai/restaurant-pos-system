import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/response";
import { prismaClient } from "../utils/prismaClient";
import { AppError } from "../utils/app-error";
import {
  CreateOrderSchema,
  CreateBuffetOrderSchema,
} from "../validators/schema";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    // Validate request body using safeParse
    const parsed = CreateOrderSchema.safeParse(req.body);

    if (!parsed.success) {
      const formattedErrors = parsed.error.flatten().fieldErrors;

      console.error("[createOrder] Validation failed for user %s:", userId);
      console.table(formattedErrors); // Logs errors beautifully in a table format

      res.status(400).json({
        message: "Validation failed",
        errors: formattedErrors,
      });
    }

    const { table_id, tax, order_items } = req.body;

    const order = await prismaClient.$transaction(async (prisma) => {
      // Calculate subtotal (total_amount) from order items
      const productPrices = await Promise.all(
        order_items.map(async (item: any) => {
          const product = await prisma.product.findUnique({
            where: { id: item.product_id },
            select: { price: true },
          });
          return product ? product.price * item.quantity : 0;
        })
      );

      const total_amount = productPrices.reduce((sum, price) => sum + price, 0);
      const grand_total = total_amount + (tax || 0);

      const order = await prisma.order.create({
        data: {
          table_id: table_id,
          user_id: userId,
          tax: tax,
          total_amount: total_amount,
          grand_total: grand_total,
          order_items: order_items
            ? {
                create: order_items.map((item: any) => ({
                  product_id: item.product_id,
                  variant_id: item.variant_id,
                  quantity: item.quantity,
                })),
              }
            : undefined,
        },
        include: {
          order_items: true,
        },
      });

      await prisma.table.update({
        where: { id: order.table_id },
        data: { status: "unavailable" },
      });

      return order;
    });

    res.status(201).json({
      statusCode: 201,
      message: "Order created successfully",
      data: order,
    });
  } catch (error: any) {
    console.error(
      "[createOrder] Error creating order for user %s: %s",
      req.user?.id,
      error
    );
    next(error);
  }
};

export const checkoutOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const order_id = req.params.id;

    const order = await prismaClient.order.findUnique({
      where: { id: +order_id },
      include: { table: true },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be checked out" });
    }

    const updatedOrder = await prismaClient.$transaction(async (prisma) => {
      const updated = await prisma.order.update({
        where: { id: +order_id },
        data: { status: "completed" },
      });

      // Optionally free the table after checkout
      await prisma.table.update({
        where: { id: order.table_id },
        data: { status: "available" },
      });

      return updated;
    });

    res.status(200).json({
      statusCode: 200,
      message: "Order checked out successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("[checkoutOrder] Error checking out order:", error);
    next(error);
  }
};

export const createBuffetOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    // Validate body
    const parsed = CreateBuffetOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      const formattedErrors = parsed.error.flatten().fieldErrors;
      console.error(
        "[createBuffetOrder] Validation failed for user %s:",
        userId
      );
      console.table(formattedErrors);
      return res.status(400).json({
        message: "Validation failed",
        errors: formattedErrors,
      });
    }

    const { table_id, tax, buffet_price, people_count, buffet_id } = req.body;

    const total_amount = buffet_price * people_count;
    const grand_total = total_amount + (tax || 0);

    const order = await prismaClient.order.create({
      data: {
        table_id: table_id,
        user_id: userId,
        is_buffet: true,
        tax: tax,
        buffet_id: buffet_id,
        total_amount: total_amount,
        grand_total: grand_total,
        people_count: people_count,
      },
    });

    res.status(201).json({
      statusCode: 201,
      message: "Buffet order created successfully",
      data: order,
    });
  } catch (error: any) {
    console.error("[createBuffetOrder] Error creating buffet order:", error);
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await prismaClient.order.findMany({
      include: {},
    });
    sendResponse(res, 200, "Orders fetched successfully!", orders);
  } catch (error) {
    console.error("[getOrders] Error:", error);
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = parseInt(req.params.id);

    if (isNaN(orderId)) {
      res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await prismaClient.order.findUnique({
      where: { id: orderId },
      include: {
        order_items: {
          include: {
            product: true,
          },
        },
        table: true,
        user: true,
        buffet: true,
      },
    });

    if (!order) {
      res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Order retrieved successfully",
      data: order,
    });
  } catch (error) {
    console.error("[getOrderById] Error fetching order:", error);
    next(error);
  }
};

export const addMoreProductsToOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const orderId = parseInt(req.params.id);

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    if (isNaN(orderId)) {
      res.status(400).json({ message: "Invalid order ID" });
    }

    const { additional_items } = req.body; // Array of { product_id, variant_id, quantity }

    if (!Array.isArray(additional_items) || additional_items.length === 0) {
      res.status(400).json({ message: "No additional items provided" });
    }

    const updatedOrder = await prismaClient.$transaction(async (prisma) => {
      // Get original order
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { order_items: true },
      });

      if (!order) {
        throw new AppError("Order not found", 404);
      }

      if (order.status !== "pending") {
        throw new AppError("Only pending orders can be updated", 400);
      }

      // Fetch prices for new products
      const additionalPrices = await Promise.all(
        additional_items.map(async (item: any) => {
          const product = await prisma.product.findUnique({
            where: { id: item.product_id },
            select: { price: true },
          });
          return product ? product.price * item.quantity : 0;
        })
      );

      const additionalAmount = additionalPrices.reduce(
        (sum, val) => sum + val,
        0
      );
      const newTotal = Number(order.total_amount) + Number(additionalAmount);
      const newGrandTotal = newTotal + Number(order.tax ?? 0);

      // Update order with new items
      const result = await prisma.order.update({
        where: { id: orderId },
        data: {
          total_amount: newTotal,
          grand_total: newGrandTotal,
          order_items: {
            create: additional_items.map((item: any) => ({
              product_id: item.product_id,
              variant_id: item.variant_id,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          order_items: true,
        },
      });

      return result;
    });

    res.status(200).json({
      statusCode: 200,
      message: "Order updated with additional products",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("[addMoreProductsToOrder] Error updating order:", error);
    next(error);
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid product ID" });
    }

    await prismaClient.product.delete({
      where: { id },
    });

    sendResponse(res, 200, "Product deleted successfully!", null);
  } catch (error: any) {
    console.error("[deleteProduct] Error:", error);
    next(error);
  }
};
