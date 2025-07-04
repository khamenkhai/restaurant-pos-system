import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/response";
import { prismaClient } from "../utils/prismaClient";
import { AppError } from "../utils/app-error";
import { CreateOrderSchema } from "../validators/schema";

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

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prismaClient.product.findMany({
      include: {
        productVariants: true,
      },
    });
    sendResponse(res, 200, "Products fetched successfully!", products);
  } catch (error) {
    console.error("[getProducts] Error:", error);
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await prismaClient.product.findUnique({
      where: { id },
      include: { productVariants: true },
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
    }

    sendResponse(res, 200, "Product fetched successfully!", product);
  } catch (error) {
    console.error("[getProductById] Error:", error);
    next(error);
  }
};

export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid product ID" });
    }

    const { name, description, price } = req.body;

    // Validate inputs if provided
    if (name !== undefined && typeof name !== "string") {
      res.status(400).json({ message: "Name must be a string" });
    }
    if (description !== undefined && typeof description !== "string") {
      res.status(400).json({ message: "Description must be a string" });
    }
    if (price !== undefined && typeof price !== "number") {
      res.status(400).json({ message: "Price must be a number" });
    }

    const updatedProduct = await prismaClient.product.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(description && { description: description.trim() }),
        ...(price !== undefined && { price }),
      },
      include: { productVariants: true },
    });

    sendResponse(res, 200, "Product updated successfully!", updatedProduct);
  } catch (error: any) {
    console.error("[updateProduct] Error:", error);
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
