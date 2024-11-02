import Subjects from "../subjects";

export default interface TicketUpdatedEvent {
    subject: Subjects.TicketCreated,
    data: {
        id: string;
        title: string;
        price: number;
        userId: string;
    };
};