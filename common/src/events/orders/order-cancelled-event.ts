import Subjects from "../subjects";
import OrderStatus from "../types/order-status";

export default interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled,
    data: {
        __v: number;
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