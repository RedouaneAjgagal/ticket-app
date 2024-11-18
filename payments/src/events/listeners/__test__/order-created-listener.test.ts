import { OrderCreatedEvent, OrderStatus } from "@redagtickets/common";
import natsWrapper from "../../../nats-wrapper";
import OrderCreatedListener from "../order-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.stan);

    const data: OrderCreatedEvent["data"] = {
        __v: 0,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (15 * 60 * 1000)).toISOString(),
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            title: "a ticket",
            price: 10
        },
        userId: new mongoose.Types.ObjectId().toHexString()
    };

    const msg: Partial<Message> = {
        ack: jest.fn()
    };

    return {
        listener,
        data,
        msg
    };
};

it('should create an order when it receive an order created event', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg as Message);

    const order = await Order.findById(data.id);

    expect(order).not.toBe(null);
    expect(order!.ticket.id).toEqual(data.ticket.id);
    expect(order!.ticket.price).toEqual(data.ticket.price);
    expect(order!.userId).toEqual(data.userId);
});

it('should ack the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg as Message);

    expect(msg.ack).toHaveBeenCalled();
});