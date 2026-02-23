import reviewModel from "../models/reviewModel.js";
import userModel from "../models/userModel.js";

// Add a review
const addReview = async (req, res) => {
    try {
        const { foodId, userId, rating, comment } = req.body;
        const user = await userModel.findById(userId);

        const newReview = new reviewModel({
            foodId,
            userId,
            userName: user.name,
            rating,
            comment
        });

        await newReview.save();
        res.json({ success: true, message: "Review added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error adding review" });
    }
}

// Get reviews for a food item
const getReviews = async (req, res) => {
    try {
        const { foodId } = req.query;
        const reviews = await reviewModel.find({ foodId });
        res.json({ success: true, data: reviews });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching reviews" });
    }
}

export { addReview, getReviews };
