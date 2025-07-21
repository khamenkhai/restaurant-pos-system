import { Request, Response, NextFunction } from "express";
import { prismaClient } from "../utils/prismaClient";
import { AppError } from "../utils/app-error";
import { sendResponse } from "../utils/response";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";

// Utility function to get start date for filtering
const getDateRange = (type: "daily" | "weekly" | "monthly") => {
  const now = dayjs();
  switch (type) {
    case "daily":
      return now.startOf("day").toDate();
    case "weekly":
      return now.startOf("week").toDate();
    case "monthly":
      return now.startOf("month").toDate();
    default:
      return now.startOf("day").toDate();
  }
};

// GET /api/reports?type=daily|weekly|monthly
export const getSalesReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const type = (req.query.type as string) || "daily";
    const startDate = getDateRange(type as "daily" | "weekly" | "monthly");

    // Completed orders only
    const orders = await prismaClient.order.findMany({
      where: {
        status: "completed",
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        order_items: {
          include: {
            product: true,
          },
        },
      },
    });

    const totalSales = orders.reduce((sum, order) => sum + Number(order.grand_total), 0);
    const totalOrders = orders.length;

    const productSalesMap: { [productId: number]: { name: string; quantity: number; total: number } } = {};

    for (const order of orders) {
      for (const item of order.order_items) {
        const id = item.product.id;
        if (!productSalesMap[id]) {
          productSalesMap[id] = {
            name: item.product.name,
            quantity: 0,
            total: 0,
          };
        }
        productSalesMap[id].quantity += item.quantity;
        productSalesMap[id].total += item.quantity * item.product.price;
      }
    }

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    const report = {
      type,
      total_sales: totalSales,
      total_orders: totalOrders,
      top_products: topProducts,
    };

    sendResponse(res, 200, `✅ ${type.toUpperCase()} report generated successfully`, report);
  } catch (error) {
    console.error("[getSalesReport] Error:", error);
    next(error);
  }
};



// Add this new method to your reports controller
export const getMonthlySalesReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const now = dayjs();
    
    // Current month data
    const currentMonthStart = now.startOf('month').toDate();
    const currentMonthEnd = now.endOf('month').toDate();
    
    // Last month data
    const lastMonthStart = now.subtract(1, 'month').startOf('month').toDate();
    const lastMonthEnd = now.subtract(1, 'month').endOf('month').toDate();

    // Function to fetch and process monthly data
    const getMonthlyData = async (startDate: Date, endDate: Date) => {
      const orders = await prismaClient.order.findMany({
        where: {
          status: "completed",
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          order_items: {
            include: {
              product: true,
            },
          },
        },
      });

      const totalSales = orders.reduce((sum, order) => sum + Number(order.grand_total), 0);
      const totalOrders = orders.length;

      const productSalesMap: { [productId: number]: { name: string; quantity: number; total: number } } = {};

      for (const order of orders) {
        for (const item of order.order_items) {
          const id = item.product.id;
          if (!productSalesMap[id]) {
            productSalesMap[id] = {
              name: item.product.name,
              quantity: 0,
              total: 0,
            };
          }
          productSalesMap[id].quantity += item.quantity;
          productSalesMap[id].total += item.quantity * item.product.price;
        }
      }

      const topProducts = Object.values(productSalesMap)
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);

      return {
        total_sales: totalSales,
        total_orders: totalOrders,
        top_products: topProducts,
        month: dayjs(startDate).format('MMMM YYYY'),
        start_date: startDate,
        end_date: endDate,
      };
    };

    // Get data for both months
    const [currentMonthData, lastMonthData] = await Promise.all([
      getMonthlyData(currentMonthStart, currentMonthEnd),
      getMonthlyData(lastMonthStart, lastMonthEnd),
    ]);

    // Calculate percentage change
    const salesChange = lastMonthData.total_sales > 0 
      ? ((currentMonthData.total_sales - lastMonthData.total_sales) / lastMonthData.total_sales) * 100 
      : 100;
    const ordersChange = lastMonthData.total_orders > 0 
      ? ((currentMonthData.total_orders - lastMonthData.total_orders) / lastMonthData.total_orders) * 100 
      : 100;

    const report = {
      current_month: currentMonthData,
      last_month: lastMonthData,
      comparison: {
        sales_change_percentage: salesChange,
        orders_change_percentage: ordersChange,
        sales_increase: currentMonthData.total_sales > lastMonthData.total_sales,
        orders_increase: currentMonthData.total_orders > lastMonthData.total_orders,
      },
    };

    sendResponse(res, 200, "✅ Monthly report generated successfully", report);
  } catch (error) {
    console.error("[getMonthlySalesReport] Error:", error);
    next(error);
  }
};