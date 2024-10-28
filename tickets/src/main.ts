import mongoose from "mongoose";
import app from "./app";


const PORT = 3000
const start = async () => {
    if (!process.env.JWT_SECRET) throw new Error("JWT Secret is required");

    try {
        await mongoose.connect("mongodb://tickets-mongo-srv:27017/ticket-tickets");
        console.log("Tickets mongo is connected!");
    } catch (error) {
        console.error(error);
    };

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

start();