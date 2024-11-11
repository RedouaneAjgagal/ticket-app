import { OrderCreatedEvent, OrderStatus } from "@redagtickets/common";
import natsWrapper from "../../../nats-wrapper";
import OrderCreatedListener from "../order-created-listener";
import mongoose from "mongoose";
import { Ticket } from "../../../models";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const newTicket = await Ticket.build({
        title: "a ticket",
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
        orders: []
    });

    const listener = new OrderCreatedListener(natsWrapper.stan);

    const data: OrderCreatedEvent["data"] = {
        __v: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date(Date.now() + (15 * 60 * 1000)).toISOString(),
        status: OrderStatus.Created,
        ticket: {
            id: newTicket.id,
            title: newTicket.title,
            price: newTicket.price
        }
    };

    const msg: Partial<Message> = {
        ack: jest.fn()
    };

    return {
        listener,
        data,
        msg,
        newTicket
    }
};

it('should insert a new order when it receive a created order event', async () => {
    const { listener, data, msg, newTicket } = await setup();
    
    expect(newTicket.orders.length).toEqual(0);
    
    await listener.onMessage(data, msg as Message);
    
    const ticket = await Ticket.findById(newTicket.id);
    expect(ticket).not.toBe(null);
    expect(ticket!.orders.length).toEqual(1);
    expect(ticket!.orders[0]).toEqual(data.id);
});

it("should ack the message", async () => {
    const { listener, data, msg } = await setup();
    
    await listener.onMessage(data, msg as Message);

    expect(msg.ack).toHaveBeenCalled();
});