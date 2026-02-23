import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    rating: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false }, // Admin will approve vendors
    description: { type: String }
}, { timestamps: true });

const restaurantModel = mongoose.models.restaurant || mongoose.model("restaurant", restaurantSchema);
export default restaurantModel;
