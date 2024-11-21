import { OrderStatus, PaymentCreatedEvent, Subjects } from "@redagtickets/common";
import { Listener } from "@redagtickets/common";
import qGroup from "./qGroup";
import { Message } from "node-nats-streaming";
import { Order } from "../../models";

export default class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
    qGroup = qGroup;
    async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderId);
        if (!order) {
            throw new Error("Order now found");
        };

        order.status = OrderStatus.Completed;
        await order.save();

        msg.ack();
    };
};
