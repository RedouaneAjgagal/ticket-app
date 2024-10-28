import mongoose from "mongoose";
import app from "./app";

const port = 3000;

const start = async () => {
    if (!process.env.JWT_SECRET) throw new Error("JWT Secret is required");

    try {
        await mongoose.connect("mongodb://auth-mongo-srv:27017/ticket-auth");
        console.log("Auth mongo is connected!")
    } catch (error) {
        console.error(error)
    }

    app.listen(port, () => {
        console.log(`Auth server is running on port ${port}`);
    });
};

start();