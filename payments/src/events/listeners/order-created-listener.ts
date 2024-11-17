import { Listener, OrderCreatedEvent, Subjects } from "@redagtickets/common";
import qGroup from "./qGroup";
import { Message } from "node-nats-streaming";
import { Order } from "../../models";

export default class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    qGroup = qGroup;
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const order = await Order.build({
            __v: data.__v,
            id: data.id,
            userId: data.userId,
            status: data.status,
            ticket: {
                id: data.ticket.id,
                price: data.ticket.price
            },
            createdAt: new Date(data.createdAt)
        });

        console.log({ order: order.toJSON() });

        msg.ack()
    };
};