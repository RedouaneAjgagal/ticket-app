import Queue from "bull";
import { publisher } from "../events";
import natsWrapper from "../nats-wrapper";

interface Payload {
    orderId: string;
};

const expirationQueue = new Queue<Payload>("order:expiration", {
    redis: {
        host: process.env.REDIS_HOST
    }
});

expirationQueue.process((job) => {
    new publisher.ExpirationCompletedPublisher(natsWrapper.stan).publish({
        orderId: job.data.orderId
    });
});

export default expirationQueue;