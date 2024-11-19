import OrderCancelledListener from "./listeners/order-cancelled-listener";
import OrderCreatedListener from "./listeners/order-created-listener";

const listener = {
    OrderCreatedListener,
    OrderCancelledListener
};

export {
    listener
}