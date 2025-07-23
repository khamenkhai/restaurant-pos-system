import { prismaClient } from "../../src/utils/prismaClient";

export const seedTables = async () => {
  try {
    const dummyTables = [
      { table_no: "T-001" },
      { table_no: "T-002" },
      { table_no: "T-003" },
      { table_no: "T-004" },
      { table_no: "T-005" },
    ];

    for (const table of dummyTables) {
      await prismaClient.table.create({ data: table });
    }

    console.log("✅ Tables seeded successfully!");
  } catch (error) {
    console.error("❌ Failed to seed tables:", error);
  } finally {
    await prismaClient.$disconnect();
  }
};

async function main() {
  console.log("🌱 Starting seed process...");
  await seedTables();
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