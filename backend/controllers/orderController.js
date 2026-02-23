import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

// Initialize Stripe only if API key is configured
let stripe = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'your_stripe_secret_key_here') {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    console.log("✅ Stripe initialized successfully");
} else {
    console.log("⚠️  Stripe not configured - payment endpoints will be disabled");
    console.log("   To enable payments, set STRIPE_SECRET_KEY in .env file");
}

// place order
const placeOrder = async (req, res) => {

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    // Check if Stripe is configured
    if (!stripe) {
        return res.json({
            success: false,
            message: "Payment gateway not configured. Please set STRIPE_SECRET_KEY in .env file."
        });
    }

    try {
        const newOrder = new orderModel({
            userId: req.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 80
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2 * 100 * 80
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error("Order placement error:", error);
        res.json({ success: false, message: error.message });
    }
}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.error("Order verification error:", error);
        res.json({ success: false, message: "Error" });
    }
}

// user orders
const userOrders = async (req, res) => {
    try {
        console.log("--- DEBUG: Fetching User Orders ---");
        console.log("Requested userId from Token:", req.userId);

        // Find ALL orders for this user string
        const orders = await orderModel.find({ userId: req.userId }).sort({ date: -1 });

        console.log("Database Query result length:", orders.length);
        if (orders.length > 0) {
            console.log("First Order UserID in DB:", orders[0].userId);
        }

        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("User orders error:", error);
        res.json({ success: false, message: error.message });
    }
}

// Listing Orders For Admin Panel

const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Order listing error:", error);
        res.json({ success: false, message: error.message });
    }
}

// api for updating order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status updated" });
    } catch (error) {
        console.error("Order status update error:", error);
        res.json({ success: false, message: error.message });
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus }
