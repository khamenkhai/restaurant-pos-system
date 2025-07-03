// import { Request, Response, NextFunction } from "express";
// import { sendResponse } from "../utils/response";
// import { PrismaClient } from "../../generated/prisma";

// const prisma = new PrismaClient();

// // -- Category Seed Data
// export const categoriesData = [
//   { name: "Burgers" },
//   { name: "Drinks" },
//   { name: "Desserts" },
//   { name: "Sides" },
//   { name: "Salads" },
//   { name: "Breakfast" },
// ];

// // -- Product Seed Data
// export const productsData = [
//   {
//     name: "Classic Burger",
//     description: "A delicious classic beef burger",
//     price: 19000,
//     categoryName: "Burgers",
//     variants: [
//       {
//         name: "Cheese Burger",
//         description: "With cheddar cheese",
//         price: 21000,
//       },
//       { name: "Bacon Burger", description: "With crispy bacon", price: 23000 },
//       { name: "Double Patty", description: "Extra beef patty", price: 27000 },
//     ],
//   },
//   {
//     name: "Veggie Burger",
//     description: "Healthy vegetarian burger",
//     price: 17000,
//     categoryName: "Burgers",
//     variants: [
//       { name: "Gluten Free Bun", price: 18000 },
//       { name: "Extra Avocado", price: 19000 },
//     ],
//   },
//   {
//     name: "Cola",
//     description: "Refreshing soft drink",
//     price: 4000,
//     categoryName: "Drinks",
//     variants: [
//       { name: "Regular", price: 4000 },
//       { name: "Large", price: 5000 },
//       { name: "Diet", price: 4000 },
//     ],
//   },
//   {
//     name: "Chocolate Cake",
//     description: "Rich and moist chocolate cake",
//     price: 10000,
//     categoryName: "Desserts",
//     variants: [
//       { name: "Slice", price: 10000 },
//       { name: "Whole Cake", price: 63000 },
//     ],
//   },
// ];

// // -- Seeder Function
// export const seedDatabase = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // ✅ Upsert all categories
//     await prisma.$transaction(
//       categoriesData.map((cat) =>
//         prisma.category.upsert({
//           where: { name: cat.name },
//           update: {},
//           create: cat,
//         })
//       )
//     );

//     // ✅ Fetch category IDs
//     const categories = await prisma.category.findMany();
//     const categoryMap = Object.fromEntries(
//       categories.map((c) => [c.name, c.id])
//     );

//     console.log("-> category map:", categoryMap);
//     console.log("-> Breakfast category ID:", categoryMap["Breakfast"]);

//     // ✅ Insert all products with nested variants
//     await prisma.$transaction(
//       productsData.map((product) =>
//         prisma.product.create({
//           data: {
//             name: product.name,
//             price: product.price,
//             category_id: categoryMap[product.categoryName],
//             productVariants: {
//               create: product.variants,
//             },
//           },
//         })
//       )
//     );

//     // ✅ Response
//     sendResponse(
//       res,
//       200,
//       "Seeded products and categories successfully!",
//       null
//     );
//   } catch (error: any) {
//     console.error("[seedDatabase] Error:", error);
//     next(error);
//   }
// };
