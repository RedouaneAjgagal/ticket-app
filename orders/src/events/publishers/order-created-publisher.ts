import { OrderCreatedEvent, Publisher, Subjects } from "@redagtickets/common";

export default class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}