import express from "express";
import { listTickets, updateTicketStatus, addResponse, createTicket, getUserTickets, getTicketDetails } from "../controllers/supportController.js";
import authMiddleware from "../middleware/auth.js";

const supportRouter = express.Router();

supportRouter.post("/create", authMiddleware, createTicket);
supportRouter.post("/user-tickets", authMiddleware, getUserTickets);
supportRouter.get("/ticket/:id", authMiddleware, getTicketDetails);
supportRouter.get("/list", authMiddleware, listTickets);
supportRouter.post("/update-status", authMiddleware, updateTicketStatus);
supportRouter.post("/response", authMiddleware, addResponse);

export default supportRouter;
