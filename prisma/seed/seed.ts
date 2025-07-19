import { prismaClient } from "../../src/utils/prismaClient";

async function seedPaymentMethods() {
  const defaultMethods = ["cash"];

  for (const name of defaultMethods) {
    await prismaClient.paymentMethod.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("✅ Seeded payment methods:", defaultMethods.join(", "));
}

seedPaymentMethods()
  .then(() => {
    console.log("🌱 Seeding complete!");
    process.exit(0);
  })
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  });
