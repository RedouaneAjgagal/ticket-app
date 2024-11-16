import mongoose from "mongoose";
import app from "./app";
import natsWrapper from "./nats-wrapper";


const PORT = 3000
const start = async () => {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required");
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required");
    if (!process.env.NATS_CLUSTER_ID) throw new Error("NATS_CLUSTER_ID is required");
    if (!process.env.NATS_CLIENT_ID) throw new Error("NATS_CLIENT_ID is required");
    if (!process.env.NATS_URL) throw new Error("NATS_URL is required");

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL,
        );

        // handle closing connection
        natsWrapper.stan.on("close", () => {
            console.log("NATS connection closed!");
            process.exit();
        });
        process.on("SIGINT", () => natsWrapper.stan.close());
        process.on("SIGTERM", () => natsWrapper.stan.close());

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Payments mongo is connected!");
    } catch (error) {
        console.error(error);
    };

    app.listen(PORT, () => {
        console.log(`Payments server is running on port ${PORT}`);
    });
}

start();