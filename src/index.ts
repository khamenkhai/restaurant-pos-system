import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { AppError } from "./utils/app-error";
import { errorHandler } from "./middlewares/errorHandler";
import categoryRoutes from "./routes/category";
import productRoutes from "./routes/product";
import tableRoutes from "./routes/table";
import authRoutes from "./routes/auth";
import orderRoutes from "./routes/order";
import historyRoutes from "./routes/history";
import reportRoutes from "./routes/report";
import cors from "cors";
import paymentMethodRoutes from "./routes/payment";
import path from "path";
import productVariantRoutes from "./routes/productVariant";
import expenseRoutes from "./routes/expense";
import buffetRoutes from "./routes/buffets";
import reservationRoute from "./routes/reservation";

// Load environment variables
dotenv.config();

// Create the Express application
const app: Application = express();

// Define port and app name from environment variables
const PORT: number = parseInt(process.env.PORT || "5000", 10);
const APP_NAME: string = process.env.APP_NAME || "MyApp";


app.use(express.json());

// Serve static files from the 'public' directory
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

app.use(cors());

app.use(categoryRoutes);
app.use(productRoutes);
app.use(tableRoutes);
app.use(authRoutes);
app.use(orderRoutes);
app.use(reportRoutes);
app.use(historyRoutes);
app.use(paymentMethodRoutes);
app.use(productVariantRoutes);
app.use(expenseRoutes);
app.use(buffetRoutes);
app.use(reservationRoute);


// Define a basic route with typed req/res
app.get("/", (_req: Request, res: Response): void => {
  res.send(`Welcome to ${APP_NAME}`);
});

// 404 handler
app.use((_req: Request, _res: Response, next) => {
  next(new AppError("Route not found", 404));
});

// Global error handler
app.use(errorHandler);


// Helper function to get local IP address
function getLocalIpAddress(): string {
  const interfaces = require("os").networkInterfaces();
  for (const interfaceName in interfaces) {
    for (const iface of interfaces[interfaceName]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "local-ip-address";
}

// app.listen(PORT, "192.168.100.203", (): void => {
//   console.log(`🚀 ${APP_NAME} is running at http://localhost:${PORT}`);
//   console.log(
//     `🚀 Also accessible on your local network at http://${getLocalIpAddress()}:${PORT}`
//   );
// });


// Start the server
app.listen(PORT, (): void => {
  console.log(`🚀 ${APP_NAME} is running at http://localhost:${PORT}`);
});
