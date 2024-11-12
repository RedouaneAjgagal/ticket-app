import { Listener, OrderCreatedEvent, Subjects } from "@redagtickets/common";
import qGroup from "./qGroup";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models";
import TicketUpdatedPublisher from "../publishers/ticket-updated-publisher";

export default class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    qGroup = qGroup;
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) {
            throw new Error("Could not find the ticket to reserve");
        }

        ticket.orders = [...ticket.orders, data.id];
        await ticket.save();

        await new TicketUpdatedPublisher(this.stan).publish({
            __v: ticket.__v,
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orders: ticket.orders
        });

        msg.ack();
    }
}