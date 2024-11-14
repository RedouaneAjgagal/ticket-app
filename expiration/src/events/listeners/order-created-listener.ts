import { Listener, OrderCreatedEvent, Subjects } from "@redagtickets/common";
import qGroup from "./qGroup";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues";

export default class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    qGroup = qGroup;
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        console.log({ data });

        const delay = new Date(data.expiresAt).getTime() - new Date(Date.now()).getTime();

        console.log(`need to wait ${delay / (1000 * 60)} min`);
        

        await expirationQueue.add({
            orderId: data.id
        }, {
            delay
        });

        msg.ack();
    }
}