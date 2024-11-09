import Subjects from "../subjects";

export default interface TicketCreatedEvent {
    subject: Subjects.TicketCreated,
    data: {
        __v: number;
        id: string;
        title: string;
        price: number;
        userId: string;
    };
};