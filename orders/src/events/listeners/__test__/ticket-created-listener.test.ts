import { TicketCreatedEvent } from "@redagtickets/common";
import natsWrapper from "../../../nats-wrapper";
import TicketCreatedListener from "../ticket-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models";

const setup = async () => {
    const listener = new TicketCreatedListener(natsWrapper.stan);

    const data: TicketCreatedEvent["data"] = {
        __v: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "a ticket",
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
        orders: []
    };

    const msg: Partial<Message> = {
        ack: jest.fn()
    };

    return {
        listener,
        data,
        msg
    };
}

it('should create a ticket when it recieve a created ticket event', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg as Message);

    const ticket = await Ticket.findById(data.id);

    expect(ticket).not.toBe(null);
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
    expect(ticket!.__v).toEqual(data.__v);
});

it('should ack the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg as Message);

    expect(msg.ack).toHaveBeenCalled();
});