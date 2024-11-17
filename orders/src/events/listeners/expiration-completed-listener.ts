import { ExpirationCompletedEvent, Listener, OrderStatus, Subjects } from "@redagtickets/common";
import qGroup from "./qGroup";
import { Message } from "node-nats-streaming";
import { Order } from "../../models";
import OrderCancelledPublisher from "../publishers/order-cancelled-publisher";

export default class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
    readonly subject = Subjects.ExpirationCompleted;
    qGroup = qGroup;
    async onMessage(data: ExpirationCompletedEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderId).populate("ticket");

        if (!order) {
            throw new Error("Order not found");
        };

        const validStatusToExpire = [OrderStatus.Created, OrderStatus.AwaitingPayment];

        if (validStatusToExpire.includes(order.status)) {
            order.status = OrderStatus.Expired;
            await order.save();

            new OrderCancelledPublisher(this.stan).publish({
                __v: order.__v,
                expiresAt: order.expiresAt.toISOString(),
                id: order.id,
                userId: order.userId,
                status: order.status,
                ticket: {
                    id: order.ticket.id,
                    title: order.ticket.title,
                    price: order.ticket.price
                },
                createdAt: order.createdAt
            });
        };

        msg.ack();
    }
}