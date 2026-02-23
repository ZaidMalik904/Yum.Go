import express from "express";
import { loginUser, registerUser, getProfile, updateProfile, listUsers, updateUserStatus, updateUser } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";
import multer from "multer";

const userRouter = express.Router();

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);

// Profile
userRouter.get("/profile", authMiddleware, getProfile);
userRouter.post("/update-profile", authMiddleware, upload.single("image"), updateProfile);

// Admin / User Management
userRouter.get("/list", authMiddleware, listUsers);
userRouter.post("/update-status", authMiddleware, updateUserStatus);
userRouter.post("/update-user", authMiddleware, upload.single("image"), updateUser);

// Testing route
userRouter.get("/test-route", (req, res) => res.json({ success: true, message: "User route is active" }));

export default userRouter;