import Subjects from "../subjects";
import OrderStatus from "../types/order-status";

export default interface OrderCreatedEvent {
    subject: Subjects.OrderCreated,
    data: {
        id: string;
        status: OrderStatus;
        expiresAt: string;
        ticket: {
            id: string;
            title: string;
            price: number;
        };
    };
};