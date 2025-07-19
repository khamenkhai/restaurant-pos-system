import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../utils/prismaClient";
import { sendResponse } from "../utils/response";

// Create
export const createPaymentMethod = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { name } = req.body;

    console.log("BODY:", req.body); // Debug: Check what's actually received
    console.log("FILE:", req.file); // Debug: Check the uploaded fil

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Invalid payment method name" });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No image in the request" });
    }

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    const method = await prismaClient.paymentMethod.create({
      data: { name: name.trim(), image: `${basePath}${fileName}` },
    });

    sendResponse(res, 200, "Payment method created successfully!", method);
  } catch (error) {
    console.error("!![createPaymentMethod] Error:", error);
    next(error);
  }
};

// Read All
export const getAllPaymentMethods = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const methods = await prismaClient.paymentMethod.findMany();
    sendResponse(res, 200, "Payment methods fetched successfully!", methods);
  } catch (error) {
    console.error("!![getAllPaymentMethods] Error:", error);
    next(error);
  }
};

// Read One
export const getPaymentMethodById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const method = await prismaClient.paymentMethod.findUnique({
      where: { id },
    });

    if (!method) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    sendResponse(res, 200, "Payment method fetched successfully!", method);
  } catch (error) {
    console.error("!![getPaymentMethodById] Error:", error);
    next(error);
  }
};

// Update
export const updatePaymentMethod = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;

    if (isNaN(id) || (name && typeof name !== "string")) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const existing = await prismaClient.paymentMethod.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    const dataToUpdate: any = {};

    if (name) {
      dataToUpdate.name = name.trim();
    }

    const file = req.file;
    if (file) {
      const fileName = file.filename;
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
      dataToUpdate.image = `${basePath}${fileName}`;
    }

    const updated = await prismaClient.paymentMethod.update({
      where: { id },
      data: dataToUpdate,
    });

    sendResponse(res, 200, "Payment method updated successfully!", updated);
  } catch (error) {
    console.error("!![updatePaymentMethod] Error:", error);
    next(error);
  }
};

// Delete
export const deletePaymentMethod = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    await prismaClient.paymentMethod.delete({
      where: { id },
    });

    sendResponse(res, 200, "Payment method deleted successfully!", null);
  } catch (error) {
    console.error("!![deletePaymentMethod] Error:", error);
    next(error);
  }
};
