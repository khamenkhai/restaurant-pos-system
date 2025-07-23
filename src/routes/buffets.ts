import { Router } from "express";
import { createBuffet, deleteBuffet, getBuffetById, getBuffets, updateBuffet } from "../controllers/buffets";

const buffetRoutes = Router();

buffetRoutes.get("/buffets", getBuffets);
buffetRoutes.get("/buffets/:id", getBuffetById);
buffetRoutes.post("/buffets", createBuffet);
buffetRoutes.put("/buffets/:id", updateBuffet);
buffetRoutes.delete("/buffets/:id", deleteBuffet);

export default buffetRoutes;