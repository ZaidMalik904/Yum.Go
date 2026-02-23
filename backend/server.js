import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js'
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import dotenv from "dotenv"
dotenv.config()
import orderRouter from './routes/orderRoute.js';
import restaurantRouter from './routes/restaurantRoute.js';
import supportRouter from './routes/supportRoute.js';
import configRouter from './routes/configRoute.js';
import reviewRouter from './routes/reviewRoute.js';

//app config
const app = express();
const port = process.env.PORT || 4000

//middlewares       
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//api endpoints
app.use("/api/food", foodRouter);
app.use('/images', express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/support", supportRouter);
app.use("/api/config", configRouter);
app.use("/api/review", reviewRouter);

app.get('/', (req, res) => {
    res.send('API Working!');
});

//db connection
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch((err) => {
    console.log("DB Connection Failed", err);
});