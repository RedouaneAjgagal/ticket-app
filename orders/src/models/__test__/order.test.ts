import { OrderStatus } from "@redagtickets/common";
import Order from "../order";
import Ticket from "../ticket";

it("should implements optimistic Concurrency control", async () => {
    const ticket = await Ticket.build({
        __v: 0,
        title: "a ticket",
        price: 10,
        orders: []
    });

    const order = await Order.build({
        userId: "123",
        status: OrderStatus.Created,
        ticket
    });

    const firstInstance = await Order.findById(order.id);
    const secondInstance = await Order.findById(order.id);

    firstInstance!.set("status", OrderStatus.AwaitingPayment);
    await firstInstance!.save();

    secondInstance!.set("status", OrderStatus.Cancelled);
    try {
        await secondInstance!.save();
    } catch (error) {
        return;
    };

    throw new Error("Doesn't implement optimistic concurrency control");
});

it('should increment the version number on each save', async () => {
    const ticket = await Ticket.build({
        __v: 0,
        title: "first ticket",
        price: 10,
        orders: []
    });

    const order = await Order.build({
        userId: "123",
        status: OrderStatus.Created,
        ticket
    });

    expect(order.__v).toEqual(0);

    order.set("status", OrderStatus.Expired);
    await order.save();
    expect(order.__v).toEqual(1);
});