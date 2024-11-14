import Subjects from "../subjects";

export default interface ExpirationCompletedEvent {
    subject: Subjects.ExpirationCompleted;
    data: {
        orderId: string;
    };
};