import natsWrapper from "./nats-wrapper";

const start = async () => {
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
    } catch (error) {
        console.error(error);
    };
}

start();