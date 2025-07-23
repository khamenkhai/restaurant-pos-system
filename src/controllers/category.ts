import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/response";
import { prismaClient } from "../utils/prismaClient";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string") {
      res.status(400).json({ message: "Invalid category name" });
    }

    const category = await prismaClient.category.create({
      data: {
        name: name.trim(),
      },
    });

    sendResponse(res, 200, "Category created success!", category);
  } catch (error: any) {
    console.error("!![createCategory] Error:", error);
    next(error);
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await prismaClient.category.findMany({});
    sendResponse(res, 200, "Category fetch success!", data);
  } catch (error) {
    console.error("!![getCategories] Error:", error);
    next(error);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryId = req.params.id;
    const data = await prismaClient.category.findUnique({
      where: {
        id: +categoryId,
      },
    });
    sendResponse(res, 200, "Category fetch success!", data);
  } catch (error) {
    console.error("!![getCategoryById] Error:", error);
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryId = Number(req.params.id);
    const { name } = req.body;

    if (!name || typeof name !== "string") {
      res.status(400).json({ message: "Invalid category name" });
    }

    const updatedCategory = await prismaClient.category.update({
      where: { id: categoryId },
      data: { name: name.trim() },
    });

    sendResponse(res, 200, "Category updated successfully!", updatedCategory);
  } catch (error: any) {
    console.error("!![updateCategory] Error:", error);
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryId = Number(req.params.id);

    await prismaClient.category.delete({
      where: { id: categoryId },
    });

    sendResponse(res, 200, "Category deleted successfully!", null);
  } catch (error: any) {
    console.error("!![deleteCategory] Error:", error);
    next(error);
  }
};

