import Subjects from "../subjects";

export default interface PaymentCreatedEvent {
    subject: Subjects.OrderCreated;
    data: {
        __v: number;
        id: string;
        orderId: string;
        chargeId: string;
    }
}