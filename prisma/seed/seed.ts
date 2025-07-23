import { prismaClient } from "../../src/utils/prismaClient";

async function seedPaymentMethods() {
  const defaultMethods = ["cash","online"];

  for (const name of defaultMethods) {
    await prismaClient.paymentMethod.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("✅ Seeded payment methods:", defaultMethods.join(", "));
}

async function seedCategoriesAndProducts() {
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

  const productData = [
    { name: "Grilled Chicken", price: 10000, is_gram: false, category: "Food" },
    { name: "Beef Burger", price: 8500, is_gram: false, category: "Food" },
    { name: "Fried Rice", price: 6500, is_gram: false, category: "Food" },
    { name: "Pasta Alfredo", price: 7500, is_gram: false, category: "Food" },
    { name: "Noodle Soup", price: 6000, is_gram: false, category: "Food" },

    { name: "Coca Cola", price: 2000, is_gram: false, category: "Drinks" },
    { name: "Iced Lemon Tea", price: 2500, is_gram: false, category: "Drinks" },
    { name: "Strawberry Smoothie", price: 3000, is_gram: false, category: "Drinks" },
    { name: "Latte", price: 3500, is_gram: false, category: "Drinks" },
    { name: "Mineral Water", price: 1000, is_gram: false, category: "Drinks" },

    { name: "Margherita Pizza", price: 9000, is_gram: false, category: "Pizza" },
    { name: "Pepperoni Pizza", price: 10000, is_gram: false, category: "Pizza" },
    { name: "Hawaiian Pizza", price: 9500, is_gram: false, category: "Pizza" },
    { name: "Vegetarian Pizza", price: 8500, is_gram: false, category: "Pizza" },
    { name: "BBQ Chicken Pizza", price: 10500, is_gram: false, category: "Pizza" },

    { name: "French Fries", price: 3000, is_gram: false, category: "Snacks" },
    { name: "Chicken Nuggets", price: 4000, is_gram: false, category: "Snacks" },
    { name: "Onion Rings", price: 3500, is_gram: false, category: "Snacks" },
    { name: "Garlic Bread", price: 2800, is_gram: false, category: "Snacks" },
    { name: "Mozzarella Sticks", price: 3800, is_gram: false, category: "Snacks" },

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

  console.log("✅ Seeded categories and products!");
}

async function main() {
  console.log("🌱 Starting seed process...");
  await seedPaymentMethods();
  await seedCategoriesAndProducts();
}

main()
  .then(() => {
    console.log("🌱 Seeding complete!");
    process.exit(0);
  })
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  });
