import { Listener, OrderCancelledEvent, Subjects } from "@redagtickets/common";
import qGroup from "./qGroup";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models";
import TicketUpdatedPublisher from "../publishers/ticket-updated-publisher";

export default class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    qGroup = qGroup;
    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) {
            throw new Error("Found no ticket");
        };

        ticket.orders = ticket.orders.filter(order => order !== data.id);
        await ticket.save();

        new TicketUpdatedPublisher(this.stan).publish({
            __v: ticket.__v,
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orders: ticket.orders
        });

        console.log({ order_cancelled_for_ticket: ticket });

        msg.ack();
    }
};