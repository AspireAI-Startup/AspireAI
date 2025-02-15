import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/db.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import assesmentRouter from "./routes/assesment.route.js";
import redisClient from "./db/redis.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

connectDb()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/v1/user", userRouter);
app.use("/api/v1/user/assesment", assesmentRouter);

app.listen(port, () => {
    console.log(`Server running at ${port}`);
});