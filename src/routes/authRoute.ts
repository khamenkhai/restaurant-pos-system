import { Router } from "express";
import { login, register, getProfile } from "../controllers/auth";
import authMiddleware from "../middlewares/authMiddleware";

const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.post("/register", register);
authRoutes.get("/profile", authMiddleware, getProfile);

export default authRoutes;
