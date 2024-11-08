import OrderCreatedPublisher from "./publishers/order-created-publisher";
import OrderCancelledPublisher from "./publishers/order-cancelled-publisher";

const publisher = {
    OrderCreatedPublisher,
    OrderCancelledPublisher
}

export {
    publisher
}