import { Listener, Subjects, TicketCreatedEvent } from "@redagtickets/common";
import { Message } from "node-nats-streaming";
import qGroup from "./qGroup";
import { Ticket } from "../../models";

export default class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    qGroup = qGroup;
    async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
        const ticket = await Ticket.build({
            __v: data.__v,
            id: data.id,
            title: data.title,
            price: data.price,
            orders: data.orders
        });
        
        console.log({ ticket: ticket.toJSON() });

        if (ticket) msg.ack();
    }
};