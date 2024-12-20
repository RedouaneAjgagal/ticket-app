enum Subjects {
    // tickets
    TicketCreated = "ticket:created",
    TicketUpdated = "ticket:updated",

    // orders
    OrderCreated = "order:created",
    OrderCancelled = "order:cancelled",

    // expiration
    ExpirationCompleted = "expiration:completed",

    // payments
    PaymentCreated = "payment:created"
};

export default Subjects;