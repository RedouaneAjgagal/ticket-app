import { Publisher, Subjects, TicketCreatedEvent } from "@redagtickets/common";

export default class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
};