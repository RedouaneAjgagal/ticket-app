import express from "express";
import "express-async-errors";
import router from "./routes/main";
import { errorHandler, notFound } from "./middlewares";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());

app.use(cookieParser(process.env.COOKIE_SECRET!));

app.use(router);

app.use(notFound);
app.use(errorHandler);


const port = 3000;

const start = async () => {
    if (!process.env.JWT_SECRET) throw new Error("JWT Secret is required");

    try {
        await mongoose.connect("mongodb://auth-mongo-srv:27017/ticket-auth");
        console.log("Mongo is connected!")
    } catch (error) {
        console.error(error)
    }

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

start();