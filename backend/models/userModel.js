import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    phone: { type: String, default: "" },
    image: { type: String, default: "" },
    cartData: { type: Object, default: {} },
    isBanned: { type: Boolean, default: false }
}, { minimize: false, timestamps: true });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;