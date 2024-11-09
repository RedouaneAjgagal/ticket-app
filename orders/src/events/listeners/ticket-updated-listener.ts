import { Ticket } from "../../models";
import { Listener, Subjects, TicketUpdatedEvent } from "@redagtickets/common";
import qGroup from "./qGroup";
import { Message } from "node-nats-streaming";

export default class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    qGroup = qGroup;
    async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
        const { id, title, price } = data;

        const ticket = await Ticket.findById(id);
        if (!ticket) {
            throw new Error("Found no ticket");
        };

        ticket.set({ title, price });
        await ticket.save();

        console.log({ ticket: ticket.toJSON() });

        msg.ack();
    }
}