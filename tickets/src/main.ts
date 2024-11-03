import mongoose from "mongoose";
import app from "./app";
import natsWrapper from "./nats-wrapper";


const PORT = 3000
const start = async () => {
    if (!process.env.JWT_SECRET) throw new Error("JWT Secret is required");
    if (!process.env.MONGO_URI) throw new Error("Mongo URI is required");

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Tickets mongo is connected!");

        natsWrapper.connect("ticketing", "123", "http://nats-srv:4222");
    } catch (error) {
        console.error(error);
    };

    app.listen(PORT, () => {
        console.log(`Tickets server is running on port ${PORT}`);
    });
}

start();