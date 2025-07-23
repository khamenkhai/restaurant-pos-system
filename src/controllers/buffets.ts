import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/response";
import { prismaClient } from "../utils/prismaClient";

export const createBuffet = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { name, description, price } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Invalid buffet name" });
    }
    
    if (!price || isNaN(parseFloat(price))) {
      return res.status(400).json({ message: "Invalid buffet price" });
    }

    const buffet = await prismaClient.buffet.create({
      data: {
        name: name.trim(),
        description: description?.trim(),
        price: parseFloat(price),
      },
    });

    sendResponse(res, 201, "Buffet created successfully!", buffet);
  } catch (error: any) {
    console.error("!![createBuffet] Error:", error);
    next(error);
  }
};

export const getBuffets = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const buffets = await prismaClient.buffet.findMany();
    sendResponse(res, 200, "Buffets fetched successfully!", buffets);
  } catch (error) {
    console.error("!![getBuffets] Error:", error);
    next(error);
  }
};

export const getBuffetById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const buffetId = req.params.id;
    const buffet = await prismaClient.buffet.findUnique({
      where: {
        id: +buffetId,
      },
    });

    if (!buffet) {
      return sendResponse(res, 404, "Buffet not found", null);
    }

    sendResponse(res, 200, "Buffet fetched successfully!", buffet);
  } catch (error) {
    console.error("!![getBuffetById] Error:", error);
    next(error);
  }
};

export const updateBuffet = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const buffetId = Number(req.params.id);
    const { name, description, price } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Invalid buffet name" });
    }
    if (price && isNaN(parseFloat(price))) {
      return res.status(400).json({ message: "Invalid buffet price" });
    }

    const updatedBuffet = await prismaClient.buffet.update({
      where: { id: buffetId },
      data: {
        name: name.trim(),
        description: description?.trim(),
        price: price ? parseFloat(price) : undefined,
      },
    });

    sendResponse(res, 200, "Buffet updated successfully!", updatedBuffet);
  } catch (error: any) {
    console.error("!![updateBuffet] Error:", error);
    next(error);
  }
};

export const deleteBuffet = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const buffetId = Number(req.params.id);

    await prismaClient.buffet.update({
      where: { id: buffetId },
      data: {
        is_deleted: true,
      }
    });

    sendResponse(res, 200, "Buffet deleted successfully!", null);
  } catch (error: any) {
    console.error("!![deleteBuffet] Error:", error);
    next(error);
  }
};