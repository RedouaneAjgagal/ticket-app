import { TicketUpdatedEvent } from "@redagtickets/common";
import natsWrapper from "../../../nats-wrapper";
import TicketUpdatedListener from "../ticket-updated-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models";

const setup = async (skipVersion = 0) => {
    const newTicket = await Ticket.build({
        __v: 0,
        title: "a ticket",
        price: 10
    });

    const listener = new TicketUpdatedListener(natsWrapper.stan);

    const data: TicketUpdatedEvent["data"] = {
        __v: (newTicket.__v + skipVersion) + 1,
        id: newTicket.id,
        title: "updated ticket",
        price: 99,
        userId: new mongoose.Types.ObjectId().toHexString()
    };

    const msg: Partial<Message> = {
        ack: jest.fn()
    };

    return {
        listener,
        data,
        msg,
        newTicket: newTicket.toJSON()
    };
}

it('should update the ticket when it receive an update ticket event', async () => {
    const { listener, data, msg, newTicket } = await setup();

    await listener.onMessage(data, msg as Message);

    const ticket = await Ticket.findById(newTicket.id);
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

it('should throw an error if the updated ticket event is out of order', async () => {
    const { listener, data, msg, newTicket } = await setup(3);

    try {
        await listener.onMessage(data, msg as Message);
    } catch (error) { }
    expect(newTicket!.title).not.toEqual(data.title);
    expect(newTicket!.price).not.toEqual(data.price);
    expect(newTicket!.__v).not.toEqual(data.__v);
});