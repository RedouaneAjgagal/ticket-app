import { Publisher, Subjects, TicketUpdatedEvent } from "@redagtickets/common";

export default class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}