import { Router } from "express";
import {
  createPaymentMethod,
  getAllPaymentMethods,
  getPaymentMethodById,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../controllers/payment-method";
import { uploadOptions } from "../middlewares/upload";

const paymentMethodRoutes = Router();

paymentMethodRoutes.post(
  "/payment-methods",
  uploadOptions.single("image"),
  createPaymentMethod
);
paymentMethodRoutes.get("/payment-methods", getAllPaymentMethods);
paymentMethodRoutes.get("/payment-methods/:id", getPaymentMethodById);
paymentMethodRoutes.put(
  "/payment-methods/:id",
  uploadOptions.single("image"),
  updatePaymentMethod
);
paymentMethodRoutes.delete("/payment-methods/:id", deletePaymentMethod);

export default paymentMethodRoutes;
