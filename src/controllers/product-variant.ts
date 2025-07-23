import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/response";
import { prismaClient } from "../utils/prismaClient";


export const createProductVariant = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const productId = Number(req.params.id);
        if (isNaN(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const { name, description, price } = req.body;

        if (!name || typeof name !== "string") {
            return res.status(400).json({ message: "Name must be a string" });
        }

        if (price === undefined || typeof price !== "number") {
            return res.status(400).json({ message: "Price must be a number" });
        }

        const variant = await prismaClient.productVariant.create({
            data: {
                name: name.trim(),
                description: description?.trim(),
                price: price,
                product_id: productId,
            },
        });

        sendResponse(res, 201, "Product variant created successfully!", variant);
    } catch (error: any) {
        console.error("[createProductVariant] Error:", error);
        next(error);
    }
};


export const updateProductVariant = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const id = Number(req.params.variantId);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid variant ID" });
        }

        const { name, description, price } = req.body;

        const updated = await prismaClient.productVariant.update({
            where: { id },
            data: {
                ...(name && typeof name === "string" && { name: name.trim() }),
                ...(description && typeof description === "string" && { description: description.trim() }),
                ...(price !== undefined && typeof price === "number" && { price }),
            },
        });

        sendResponse(res, 200, "Variant updated successfully!", updated);
    } catch (error) {
        console.error("[updateProductVariant] Error:", error);
        next(error);
    }
};

export const deleteProductVariant = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const id = Number(req.params.variantId);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid variant ID" });
        }

        await prismaClient.productVariant.update({
            where: { id },
            data: {
                is_deleted: true,
            },
        });

        sendResponse(res, 200, "Variant deleted successfully!", null);
    } catch (error) {
        console.error("[deleteProductVariant] Error:", error);
        next(error);
    }
};
