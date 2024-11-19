import { OrderCancelledEvent, OrderStatus } from "@redagtickets/common";
import natsWrapper from "../../../nats-wrapper";
import OrderCancelledListener from "../order-cancelled-listener";
import { Order } from "../../../models";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.stan);

    const orderId = new mongoose.Types.ObjectId().toHexString();
    const userId = new mongoose.Types.ObjectId().toHexString()

    const newOrder = await Order.build({
        __v: 0,
        id: orderId,
        createdAt: new Date(),
        status: OrderStatus.Created,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 10
        },
        userId
    });

    const data: OrderCancelledEvent["data"] = {
        __v: 1,
        createdAt: new Date(newOrder.createdAt).toISOString(),
        expiresAt: new Date().toISOString(),
        id: newOrder.id,
        status: OrderStatus.Cancelled,
        ticket: {
            id: newOrder.ticket.id,
            price: newOrder.ticket.price,
            title: "a ticket"
        },
        userId
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

it('should set the order as cancelled when it receive an order cancelled event', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg as Message);

    const order = await Order.findById(data.id);

    expect(order).not.toBe(null);
    expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it('should increment the version on each save', async () => {
    const { listener, data, msg, newOrder } = await setup();

    await listener.onMessage(data, msg as Message);

    const order = await Order.findById(data.id);

    expect(order).not.toBe(null);
    expect(order!.__v).toEqual(newOrder.__v + 1);
});

it('should ack the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg as Message);

    expect(msg.ack).toHaveBeenCalled();
});