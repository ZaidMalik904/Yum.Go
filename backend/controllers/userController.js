import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// login user

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.json({ success: false, message: "Please provide email and password" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }
        const token = createToken(user._id);
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone || "",
                role: user.role,
                image: user.image
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.json({ success: false, message: "Error logging in" });
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// register User

const registerUser = async (req, res) => {
    const { name, email, password, role, phone } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
            phone: phone || "",
            role: role || "user"
        });
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone || "",
                role: user.role,
                image: user.image
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.json({ success: false, message: "Error registering user" });
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone || "",
                role: user.role,
                image: user.image
            }
        });
    } catch (error) {
        console.error("Get Profile error:", error);
        res.json({ success: false, message: "Error fetching profile" });
    }
}

const updateProfile = async (req, res) => {
    const { name, email, phone } = req.body;
    const userId = req.userId;

    let updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;

    if (req.file) {
        updateData.image = req.file.filename;
    }

    try {
        if (!userId) {
            return res.json({ success: false, message: "User authentication failed. Please login again." });
        }
        console.log("Updating profile for ID:", userId, "Data:", updateData);
        const user = await userModel.findByIdAndUpdate(userId, updateData, { new: true });
        if (!user) {
            return res.json({ success: false, message: "User account not found" });
        }
        res.json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone || "",
                role: user.role,
                image: user.image
            }
        });
    } catch (error) {
        console.error("Update Profile error:", error);
        res.json({ success: false, message: "Server error: " + error.message });
    }
}

const listUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.json({ success: true, data: users });
    } catch (error) {
        console.error("List users error:", error);
        res.json({ success: false, message: "Error fetching users" });
    }
}

const updateUserStatus = async (req, res) => {
    try {
        const { id, isBanned } = req.body;
        await userModel.findByIdAndUpdate(id, { isBanned });
        res.json({ success: true, message: "User status updated" });
    } catch (error) {
        console.error("Update user status error:", error);
        res.json({ success: false, message: "Error updating status" });
    }
}

const updateUser = async (req, res) => {
    const { id, name, email, phone } = req.body;

    let updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;

    if (req.file) {
        updateData.image = req.file.filename;
    }

    try {
        if (!id) {
            return res.json({ success: false, message: "Invalid User Request: ID Missing" });
        }
        console.log("Admin updating user ID:", id, "Data:", updateData);
        const user = await userModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!user) {
            return res.json({ success: false, message: "Customer record not found" });
        }
        res.json({
            success: true,
            message: "User profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone || "",
                role: user.role,
                image: user.image
            }
        });
    } catch (error) {
        console.error("Update user error:", error);
        res.json({ success: false, message: "Database Error: " + error.message });
    }
}

export { loginUser, registerUser, getProfile, updateProfile, listUsers, updateUserStatus, updateUser };