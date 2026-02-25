import restaurantModel from "../models/restaurantModel.js";
import fs from 'fs';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register Restaurant
const registerRestaurant = async (req, res) => {
    let image_filename = `${req.file.filename}`;
    const { name, email, password, address, phone, description } = req.body;

    try {
        const exists = await restaurantModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Restaurant already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const { name, email, password, address, phone, description } = req.body;
        const hashedPassword = await bcrypt.hash(password, salt);

        const newRestaurant = new restaurantModel({
            name,
            email,
            password: hashedPassword,
            address,
            phone,
            description,

            image: image_filename
        });

        await newRestaurant.save();
        res.json({ success: true, message: "Restaurant Registered Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error Registering Restaurant" });
    }
}

// List all restaurants
const listRestaurants = async (req, res) => {
    try {
        const restaurants = await restaurantModel.find({});
        res.json({ success: true, data: restaurants });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching restaurants" });
    }
}

// Update Restaurant Status (Approve/Reject)
const updateStatus = async (req, res) => {
    try {
        const { id, isApproved } = req.body;
        console.log(`[StatusUpdate] ID: ${id}, NewStatus: ${isApproved}`);
        await restaurantModel.findByIdAndUpdate(id, { isApproved });
        res.json({ success: true, message: "Status Updated Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating status" });
    }
}



// Remove Restaurant
const removeRestaurant = async (req, res) => {
    try {
        const restaurant = await restaurantModel.findById(req.body.id);
        if (!restaurant) {
            return res.json({ success: false, message: "Restaurant Not Found" });
        }

        // Remove image file
        if (restaurant.image) {
            fs.unlink(`uploads/${restaurant.image}`, () => { });
        }

        await restaurantModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Restaurant Removed Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing restaurant" });
    }
}

// Get single restaurant details
const getRestaurantDetails = async (req, res) => {
    try {
        const restaurant = await restaurantModel.findById(req.params.id);
        res.json({ success: true, data: restaurant });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching restaurant details" });
    }
}

export { registerRestaurant, listRestaurants, getRestaurantDetails, updateStatus, removeRestaurant };
