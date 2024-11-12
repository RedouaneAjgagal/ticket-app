import Subjects from "../subjects";

export default interface TicketUpdatedEvent {
    subject: Subjects.TicketUpdated,
    data: {
        __v: number;
        id: string;
        title: string;
        price: number;
        userId: string;
        orders: string[];
    };
};