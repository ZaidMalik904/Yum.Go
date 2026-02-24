import supportModel from "../models/supportModel.js";
import userModel from "../models/userModel.js";

const createTicket = async (req, res) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] [BACKEND] createTicket Request for ID: ${req.userId}`);

    try {
        const userId = req.userId;
        const { subject, message } = req.body;

        if (!subject || !message) {
            return res.json({ success: false, message: "Subject and Message are required" });
        }

        // Try to find user, but don't crash if not found
        const user = await userModel.findById(userId);
        const nameToUse = user ? user.name : "Valued Customer";

        const newTicket = new supportModel({
            userId: userId || "anonymous",
            userName: nameToUse,
            subject,
            message,
            responses: []
        });

        await newTicket.save();

        console.log(`[${timestamp}] [BACKEND] Ticket Created: ${newTicket._id}`);
        res.json({ success: true, message: "Ticket Created Successfully" });
    } catch (error) {
        console.error(`[${timestamp}] [BACKEND] Error:`, error);
        res.json({ success: false, message: "Server Error: " + error.message });
    }
}

const getUserTickets = async (req, res) => {
    try {
        const userId = req.userId;
        const tickets = await supportModel.find({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, data: tickets });
    } catch (error) {
        res.json({ success: false, message: "Error" });
    }
}

const getTicketDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await supportModel.findById(id);
        res.json({ success: true, data: ticket });
    } catch (error) {
        res.json({ success: false, message: "Error" });
    }
}

const listTickets = async (req, res) => {
    try {
        const tickets = await supportModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: tickets });
    } catch (error) {
        res.json({ success: false, message: "Error" });
    }
}

const addResponse = async (req, res) => {
    try {
        const { id, response } = req.body;
        console.log(`[BACKEND] New Response for ${id} from ${response.sender}`);
        const updatedTicket = await supportModel.findByIdAndUpdate(
            id,
            { $push: { responses: { ...response, time: new Date() } } },
            { new: true }
        );
        res.json({ success: true, data: updatedTicket });
    } catch (error) {
        console.log("[BACKEND] Response Error:", error);
        res.json({ success: false, message: "Error" });
    }
}

const updateTicketStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        await supportModel.findByIdAndUpdate(id, { status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        res.json({ success: false, message: "Error" });
    }
}

export { createTicket, getUserTickets, getTicketDetails, listTickets, addResponse, updateTicketStatus };
