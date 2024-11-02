import { Message, Stan } from "node-nats-streaming";
import Subjects from "./subjects";

interface Event {
    subject: Subjects;
    data: unknown;
}

export default abstract class Listener<T extends Event> {
    abstract subject: T["subject"];
    abstract qGroup: string;
    abstract onMessage(data: T["data"], msg: Message): void;

    private stan: Stan;

    protected ackWait = 5 * 1000;

    constructor(stan: Stan) {
        this.stan = stan;
    }

    subscriptionOptions() {
        return this.stan.subscriptionOptions()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDeliverAllAvailable()
            .setDurableName(this.qGroup);
    }

    listen() {
        const subscriber = this.stan.subscribe(this.subject, this.qGroup, this.subscriptionOptions());

        subscriber.on("message", (msg: Message) => {
            console.log(
                `Message received: ${this.subject} / ${this.qGroup}`
            );

            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }

    parseMessage(msg: Message) {
        const data = msg.getData();

        return typeof data === "string"
            ? JSON.parse(data)
            : JSON.parse(data.toString("utf-8"));
    }
};