import { ExpirationCompletedEvent, Publisher, Subjects } from "@redagtickets/common";

export default class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
    readonly subject = Subjects.ExpirationCompleted;
};