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


export const seedCategoriesAndProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Step 1: Seed categories
    const categoryData = [
      { name: "Appetizers" },
      { name: "Main Course" },
      { name: "Desserts" },
      { name: "Beverages" },
      { name: "Specials" },
    ];

    const categoryMap: { [name: string]: number } = {};

    for (const category of categoryData) {
      const cat = await prismaClient.category.upsert({
        where: { name: category.name },
        update: {},
        create: { name: category.name },
      });
      categoryMap[category.name] = cat.id;
    }

    // Step 2: Seed products
    const productData = [
      { name: "Spring Rolls", price: 3500, is_gram: false, category: "Appetizers" },
      { name: "Steak with Fries", price: 12000, is_gram: false, category: "Main Course" },
      { name: "Chocolate Cake", price: 4500, is_gram: false, category: "Desserts" },
      { name: "Mango Juice", price: 2500, is_gram: false, category: "Beverages" },
      { name: "Chef Special Noodles", price: 8000, is_gram: false, category: "Specials" },
    ];

    const insertedProducts = [];

    for (const product of productData) {
      const created = await prismaClient.product.upsert({
        where: { name: product.name },
        update: {},
        create: {
          name: product.name,
          price: product.price,
          is_gram: product.is_gram,
          category_id: categoryMap[product.category],
        },
      });
      insertedProducts.push(created);
    }

    sendResponse(res, 200, "✅ Categories and Products seeded successfully!", {
      categories: categoryMap,
      products: insertedProducts,
    });
  } catch (error) {
    console.error("❌ [seedCategoriesAndProducts] Error:", error);
    next(error);
  }
};


export const seedCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = [
      { name: "Appetizers" },
      { name: "Main Course" },
      { name: "Desserts" },
      { name: "Beverages" },
      { name: "Specials" },
    ];

    const inserted = [];

    for (const category of categories) {
      const cat = await prismaClient.category.upsert({
        where: { name: category.name },
        update: {},
        create: { name: category.name },
      });
      inserted.push(cat);
    }

    sendResponse(res, 200, "✅ Categories seeded successfully!", inserted);
  } catch (error) {
    console.error("❌ [seedCategories] Error seeding categories:", error);
    next(error);
  }
};

