import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/db.js";
import cookieParser from "cookie-parser";

dotenv.config() ;

const app = express();
const port = process.env.PORT || 4000;

connectDb()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.listen(port , () => {
    console.log(`Server running at ${port}`);
});