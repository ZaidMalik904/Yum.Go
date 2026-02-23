import express from "express";
import { registerRestaurant, listRestaurants, getRestaurantDetails, updateStatus, removeRestaurant } from "../controllers/restaurantController.js";
import multer from "multer";

const restaurantRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

restaurantRouter.post("/register", upload.single("image"), registerRestaurant);
restaurantRouter.get("/list", listRestaurants);
restaurantRouter.get("/details/:id", getRestaurantDetails);
restaurantRouter.post("/update-status", updateStatus);
restaurantRouter.post("/remove", removeRestaurant);

export default restaurantRouter;
