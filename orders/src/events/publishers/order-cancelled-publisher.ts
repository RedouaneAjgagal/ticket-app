import { OrderCancelledEvent, Publisher, Subjects } from "@redagtickets/common";

export default class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}