import Subjects from "../subjects";

export default interface PaymentCreatedEvent {
    subject: Subjects.PaymentCreated;
    data: {
        __v: number;
        id: string;
        orderId: string;
        chargeId: string;
    }
}