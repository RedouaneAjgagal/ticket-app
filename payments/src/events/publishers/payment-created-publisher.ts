import { PaymentCreatedEvent, Publisher, Subjects } from "@redagtickets/common";

export default class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
};