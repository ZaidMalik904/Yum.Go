import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    foodId: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
})

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);
export default reviewModel;
