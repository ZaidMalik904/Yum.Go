import express from "express";
import { getConfig, updateConfig } from "../controllers/configController.js";
import authMiddleware from "../middleware/auth.js";

const configRouter = express.Router();

configRouter.get("/get", getConfig);
configRouter.post("/update", authMiddleware, updateConfig);

export default configRouter;
