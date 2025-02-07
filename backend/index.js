import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";


dotenv.config() ;

const app = express();

const port = process.env.PORT || 4000;

app.listen(port , () => {
    console.log(`server running at ${port}`);
});




