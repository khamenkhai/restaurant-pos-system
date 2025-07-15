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
      { name: "Food" },
      { name: "Drinks" },
      { name: "Pizza" },
      { name: "Snacks" },
      { name: "Desserts" },
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
      // Food
      { name: "Grilled Chicken", price: 10000, is_gram: false, category: "Food" },
      { name: "Beef Burger", price: 8500, is_gram: false, category: "Food" },
      { name: "Fried Rice", price: 6500, is_gram: false, category: "Food" },
      { name: "Pasta Alfredo", price: 7500, is_gram: false, category: "Food" },
      { name: "Noodle Soup", price: 6000, is_gram: false, category: "Food" },

      // Drinks
      { name: "Coca Cola", price: 2000, is_gram: false, category: "Drinks" },
      { name: "Iced Lemon Tea", price: 2500, is_gram: false, category: "Drinks" },
      { name: "Strawberry Smoothie", price: 3000, is_gram: false, category: "Drinks" },
      { name: "Latte", price: 3500, is_gram: false, category: "Drinks" },
      { name: "Mineral Water", price: 1000, is_gram: false, category: "Drinks" },

      // Pizza
      { name: "Margherita Pizza", price: 9000, is_gram: false, category: "Pizza" },
      { name: "Pepperoni Pizza", price: 10000, is_gram: false, category: "Pizza" },
      { name: "Hawaiian Pizza", price: 9500, is_gram: false, category: "Pizza" },
      { name: "Vegetarian Pizza", price: 8500, is_gram: false, category: "Pizza" },
      { name: "BBQ Chicken Pizza", price: 10500, is_gram: false, category: "Pizza" },

      // Snacks
      { name: "French Fries", price: 3000, is_gram: false, category: "Snacks" },
      { name: "Chicken Nuggets", price: 4000, is_gram: false, category: "Snacks" },
      { name: "Onion Rings", price: 3500, is_gram: false, category: "Snacks" },
      { name: "Garlic Bread", price: 2800, is_gram: false, category: "Snacks" },
      { name: "Mozzarella Sticks", price: 3800, is_gram: false, category: "Snacks" },

      // Desserts
      { name: "Ice Cream Sundae", price: 4000, is_gram: false, category: "Desserts" },
      { name: "Brownie with Ice Cream", price: 4500, is_gram: false, category: "Desserts" },
      { name: "Fruit Salad", price: 3500, is_gram: false, category: "Desserts" },
      { name: "Cheesecake", price: 5000, is_gram: false, category: "Desserts" },
      { name: "Pudding", price: 3000, is_gram: false, category: "Desserts" },
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
