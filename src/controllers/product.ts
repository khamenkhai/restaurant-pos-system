import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/response";
import { prismaClient } from "../utils/prismaClient";


export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, price, variants, categoryId } = req.body;

    if (categoryId === undefined ) {
      // next(new AppError("Valid category id is required!"))
      res.status(400).json({ message: "Valid categoryId is required" });
    }
    // Basic validation
    if (!name || typeof name !== "string") {
      res
        .status(400)
        .json({ message: "Product name is required and must be a string" });
    }
    if (description && typeof description !== "string") {
      res.status(400).json({ message: "Description must be a string" });
    }
    if (price !== undefined && typeof price !== "number") {
      res.status(400).json({ message: "Price must be a number" });
    }
    if (variants && !Array.isArray(variants)) {
      res.status(400).json({ message: "Variants must be an array" });
    }

    // Create product with optional variants
    const product = await prismaClient.product.create({
      data: {
        name: name.trim(),
        price: price,
        category_id: +categoryId,
        productVariants: variants
          ? {
            create: variants.map((variant: any) => ({
              name: variant.name,
              description: variant.description,
              price: variant.price,
            })),
          }
          : undefined,
      },
      include: {
        productVariants: true,
      },
    });

    sendResponse(res, 201, "Product created successfully!", product);
  } catch (error: any) {
    console.error("[createProduct] Error:", error);
    next(error);
  }
};

export const getProducts = async (
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

export const getProductById = async (
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

export const updateProduct = async (
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

export const deleteProduct = async (
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
