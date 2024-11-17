import { OrderCancelledEvent, OrderStatus, Subjects, TicketUpdatedEvent } from "@redagtickets/common";
import natsWrapper from "../../../nats-wrapper"
import OrderCancelledListener from "../order-cancelled-listener"
import mongoose from "mongoose";
import { Ticket } from "../../../models";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listen = new OrderCancelledListener(natsWrapper.stan);

    const orderId = new mongoose.Types.ObjectId().toHexString();

    const newTicket = await Ticket.build({
        title: "a ticket",
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
        orders: [orderId]
    });

    const data: OrderCancelledEvent["data"] = {
        __v: 1,
        id: orderId,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date(Date.now() + (15 * 60 * 1000)).toISOString(),
        status: OrderStatus.Cancelled,
        ticket: {
            id: newTicket.id,
            title: newTicket.title,
            price: newTicket.price
        },
        createdAt: new Date().toISOString()
    };

    const msg: Partial<Message> = {
        ack: jest.fn()
    };

    return {
        listen,
        newTicket,
        data,
        msg
    };
};

it('should filter out the order from the ticket orders', async () => {
    const { listen, data, msg } = await setup();

    await listen.onMessage(data, msg as Message);

    const ticket = await Ticket.findById(data.ticket.id);
    expect(ticket).not.toBe(null);
    expect(ticket!.orders.includes(data.id)).toBe(false);
});

it('should ack the message', async () => {
    const { listen, data, msg } = await setup();

    await listen.onMessage(data, msg as Message);

    expect(msg.ack).toHaveBeenCalled();
});

it('should publish a ticket updated event', async () => {
    const { listen, data, msg } = await setup();

    await listen.onMessage(data, msg as Message);

    expect(natsWrapper.stan.publish).toHaveBeenCalled();

    const calledWith = (natsWrapper.stan.publish as jest.Mock).mock.calls[0];
    const subject = calledWith[0];
    expect(subject).toEqual(Subjects.TicketUpdated);

    const publishedWith = JSON.parse(calledWith[1]) as TicketUpdatedEvent["data"];
    expect(publishedWith.id).toEqual(data.ticket.id);
});