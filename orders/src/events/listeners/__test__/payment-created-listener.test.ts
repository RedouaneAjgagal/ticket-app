import { OrderStatus, PaymentCreatedEvent } from "@redagtickets/common";
import natsWrapper from "../../../nats-wrapper"
import PaymentCreatedListener from "../payment-created-listener"
import mongoose from "mongoose";
import { Order, Ticket } from "../../../models";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new PaymentCreatedListener(natsWrapper.stan);

    const ticket = await Ticket.build({
        __v: 0,
        price: 10,
        title: "a ticket"
    });

    const newOrder = await Order.build({
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        ticket
    });

    const data: PaymentCreatedEvent["data"] = {
        __v: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        chargeId: "ch_3MmlLrLkdIwHu7ix0snN0B15",
        orderId: newOrder._id.toHexString()
    };

    const msg: Partial<Message> = {
        ack: jest.fn()
    };

    return {
        listener,
        newOrder,
        data,
        msg
    }
};

it('should listen to new payments', async () => {
    const { listener, newOrder, data, msg } = await setup();

    expect(newOrder.status).not.toEqual(OrderStatus.Completed);

    await listener.onMessage(data, msg as Message);

    const order = await Order.findById(newOrder._id.toHexString());
    expect(order).not.toBe(null);
    expect(order!.status).toEqual(OrderStatus.Completed);
});

it('should ack the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg as Message);

    expect(msg.ack).toHaveBeenCalled();
});