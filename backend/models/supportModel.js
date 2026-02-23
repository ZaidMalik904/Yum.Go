import mongoose from "mongoose";

const supportSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: "Open" }, // Open, Priority, Resolved
    priority: { type: Boolean, default: false },
    responses: [{
        sender: { type: String }, // 'admin' or 'user'
        text: { type: String },
        time: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const supportModel = mongoose.models.support || mongoose.model("support", supportSchema);
export default supportModel;
