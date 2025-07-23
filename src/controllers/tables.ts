import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/response";
import { prismaClient } from "../utils/prismaClient";

// Create Table
export const createTable = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { table_no } = req.body;

    if (!table_no || typeof table_no !== "string") {
      res.status(400).json({ message: "Invalid table number" });
    }

    const table = await prismaClient.table.create({
      data: {
        table_no: table_no.trim(),
      },
    });

    sendResponse(res, 200, "Table created successfully!", table);
  } catch (error: any) {
    console.error("!![createTable] Error:", error);
    next(error);
  }
};

export const getAllTables = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const tables = await prismaClient.table.findMany({
      include: {
        orders: {
          where: {
            status: "pending", // Only get pending orders (active orders)
          },
          select: {
            id: true,
            status: true,
          },
          take: 1, // Get only the most recent pending order
        },
      },
    });

    // Map tables with current_order_id only if there's a pending order
    const formattedTables = tables.map((table : any) => {
      const hasPendingOrder =
        table.orders.length > 0 && table.orders[0].status === "pending";

      return {
        id: table.id,
        table_no: table.table_no,
        status: hasPendingOrder ? "unavailable" : "available", // Update table status based on order
        current_order_id: hasPendingOrder ? table.orders[0].id : null,
      };
    });

    sendResponse(res, 200, "Tables fetched successfully!", formattedTables);
  } catch (error) {
    console.error("!![getAllTables] Error:", error);
    next(error);
  }
};

export const getAllTables2 = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tables = await prismaClient.table.findMany({
      include: {
        orders: {
          where: {
            status: "pending",
          },
          select: {
            id: true,
            status: true,
          },
          take: 1, // Assuming one active order per table
        },
      },
    });

    // Map to include `current_order_id`
    const formattedTables = tables.map((table : any) => ({
      id: table.id,
      table_no: table.table_no,
      status: table.status,
      current_order_id: table.orders[0]?.id ?? null,
    }));

    sendResponse(res, 200, "Tables fetched successfully!", formattedTables);
  } catch (error) {
    console.error("!![getAllTables] Error:", error);
    next(error);
  }
};

// Get Table by ID
export const getTableById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tableId = Number(req.params.id);

    if (isNaN(tableId)) {
      res.status(400).json({ message: "Invalid table ID" });
    }

    const table = await prismaClient.table.findUnique({
      where: {
        id: tableId,
      },
    });

    if (!table) {
      res.status(404).json({ message: "Table not found" });
    }

    sendResponse(res, 200, "Table fetched successfully!", table);
  } catch (error) {
    console.error("!![getTableById] Error:", error);
    next(error);
  }
};

// Update Table
export const updateTable = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tableId = Number(req.params.id);
    const { table_no } = req.body;

    if (isNaN(tableId) || !table_no || typeof table_no !== "string") {
      res.status(400).json({ message: "Invalid input data" });
    }

    const updatedTable = await prismaClient.table.update({
      where: { id: tableId },
      data: { table_no: table_no.trim() },
    });

    sendResponse(res, 200, "Table updated successfully!", updatedTable);
  } catch (error: any) {
    console.error("!![updateTable] Error:", error);
    next(error);
  }
};

// Delete Table
export const deleteTable = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tableId = Number(req.params.id);

    if (isNaN(tableId)) {
      res.status(400).json({ message: "Invalid table ID" });
    }

    await prismaClient.table.delete({
      where: { id: tableId },
    });

    sendResponse(res, 200, "Table deleted successfully!", null);
  } catch (error: any) {
    console.error("!![deleteTable] Error:", error);
    next(error);
  }
};

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
