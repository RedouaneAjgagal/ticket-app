import { Ticket } from "../../models";
import { Listener, Subjects, TicketUpdatedEvent } from "@redagtickets/common";
import qGroup from "./qGroup";
import { Message } from "node-nats-streaming";

export default class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    qGroup = qGroup;
    async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
        const { title, price, __v, orders } = data;

        const ticket = await Ticket.findByEvent(data);

        if (typeof ticket === "string") {
            throw new Error(ticket);
        };

        ticket.set({ title, price, __v, orders });
        await ticket.save();

        console.log({ ticket: ticket.toJSON() });

        msg.ack();
    }
}