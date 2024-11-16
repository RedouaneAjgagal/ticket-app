import { ExpirationCompletedEvent, OrderStatus, Subjects } from "@redagtickets/common";
import { Order, Ticket } from "../../../models";
import natsWrapper from "../../../nats-wrapper"
import ExpirationCompletedListener from "../expiration-completed-listener"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async (orderStatus: OrderStatus) => {
    const listener = new ExpirationCompletedListener(natsWrapper.stan);

    const newTicket = await Ticket.build({
        __v: 0,
        title: "a ticket",
        price: 10
    });

    const newOrder = await Order.build({
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: orderStatus,
        ticket: newTicket
    });

    const data: ExpirationCompletedEvent["data"] = {
        orderId: newOrder.id
    };

    const msg: Partial<Message> = {
        ack: jest.fn()
    };

    return {
        listener,
        newOrder,
        data,
        msg
    };
};

it('should not expire an order if it has already been completed, cancelled or expired', async () => {
    const orderStatus = [OrderStatus.Completed, OrderStatus.Cancelled, OrderStatus.Expired];

    for (const getOrderStatus of orderStatus) {
        const { data, listener, msg, newOrder } = await setup(getOrderStatus);

        await listener.onMessage(data, msg as Message);

        const order = await Order.findById(newOrder.id);
        expect(order).not.toBe(null);
        expect(order!.status).toEqual(getOrderStatus);
    };
});

it('should expire the order if it has created or awaitingPayment status', async () => {
    const orderStatus = [OrderStatus.Created, OrderStatus.AwaitingPayment];

    for (const getOrderStatus of orderStatus) {
        const { data, listener, msg, newOrder } = await setup(getOrderStatus);

        await listener.onMessage(data, msg as Message);

        const order = await Order.findById(newOrder.id);
        expect(order).not.toBe(null);
        expect(order!.status).toEqual(OrderStatus.Expired);
    };
});

it('should publish cancelled order event after it set the order as expired', async () => {
    const { data, listener, msg, newOrder } = await setup(OrderStatus.Created);

    await listener.onMessage(data, msg as Message);

    expect(natsWrapper.stan.publish).toHaveBeenCalled();
    const calledWith = (natsWrapper.stan.publish as jest.Mock).mock.calls[0];

    const subject = calledWith[0];
    expect(subject).toEqual(Subjects.OrderCancelled);

    const publishedWith = JSON.parse(calledWith[1]);
    expect(publishedWith.id).toEqual(newOrder.id);
    expect(publishedWith.status).toEqual(OrderStatus.Expired);
});

it('should ack the message', async () => {
    const { data, listener, msg } = await setup(OrderStatus.Created);

    await listener.onMessage(data, msg as Message);

    expect(msg.ack).toHaveBeenCalled();
});