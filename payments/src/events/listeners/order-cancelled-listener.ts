import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@redagtickets/common";
import qGroup from "./qGroup";
import { Message } from "node-nats-streaming";
import { Order } from "../../models";

export default class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    qGroup = qGroup;
    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        const order = await Order.findByEvent({
            orderId: data.id,
            __v: data.__v
        });

        if (typeof order === "string") {
            throw new Error(order);
        };

        order.status = OrderStatus.Cancelled;
        order.__v = data.__v;
        await order.save();

        console.log({ orderCancelled: order });

        msg.ack();
    };
};