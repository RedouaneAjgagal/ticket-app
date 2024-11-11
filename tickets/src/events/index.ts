import OrderCreatedListener from "./listeners/order-created-listener";
import TicketCreatedPublisher from "./publishers/ticket-created-publisher";
import TicketUpdatedPublisher from "./publishers/ticket-updated-publisher";

const publisher = {
    TicketCreatedPublisher,
    TicketUpdatedPublisher
};

const listener = {
    OrderCreatedListener
}

export {
    publisher,
    listener
}