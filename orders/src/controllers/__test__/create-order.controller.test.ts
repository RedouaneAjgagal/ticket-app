import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { Order, Ticket } from "../../models";
import { OrderStatus } from "@redagtickets/common";

const ticketId = new mongoose.Types.ObjectId();

const validInputs = {
    ticketId: ticketId.toHexString()
};

const invalidInputs = {
    ticketId: "invalidId"
};

it("should return a 401 if the user is not signed in", async () => {
    await request(app)
        .post("/api/orders")
        .send(validInputs)
        .expect(401);
});

it("should return a 400 if the user provide invalid inputs", async () => {
    const { cookie } = global.signin();

    await request(app)
        .post("/api/orders")
        .set("Cookie", cookie)
        .send(invalidInputs)
        .expect(400)
});

it("should return a 400 if the ticket doesn't exist", async () => {
    const { cookie } = global.signin();

    await request(app)
        .post("/api/orders")
        .set("Cookie", cookie)
        .send(validInputs)
        .expect(400)
});

it("should return a 400 if the ticket is already reserved", async () => {
    const { cookie } = global.signin();

    const ticket = await Ticket.build({
        title: "a ticket title",
        price: 10
    });

    await Order.build({
        userId: "user_id",
        ticket,
        status: OrderStatus.Created
    });

    await request(app)
        .post("/api/orders")
        .set("Cookie", cookie)
        .send({
            ticketId: ticket.id
        })
        .expect(400);
});

it("should return 201 if an order has been created and stored in the database", async () => {
    const { cookie } = global.signin();

    const INITIAL_NUM_ORDERS = 0;

    let orders = await Order.find({});

    expect(orders.length).toEqual(INITIAL_NUM_ORDERS);

    const ticket = await Ticket.build({
        title: "a titcket title",
        price: 10
    });

    await request(app)
        .post("/api/orders")
        .set("Cookie", cookie)
        .send({ ticketId: ticket.id })
        .expect(201);

    orders = await Order.find({});
    expect(orders.length).toEqual(INITIAL_NUM_ORDERS + 1);
});