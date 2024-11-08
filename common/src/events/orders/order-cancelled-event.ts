import Subjects from "../subjects";
import OrderStatus from "../types/order-status";

export default interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled,
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