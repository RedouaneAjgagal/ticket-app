import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models";
import { OrderStatus } from "@redagtickets/common";

it("should return a 401 if the user is not signed in", async () => {
    const orderId = new mongoose.Types.ObjectId();
    await request(app)
        .patch(`/api/orders/${orderId}`)
        .send()
        .expect(401);
});

it("should return a 400 if its invalid order ID", async () => {
    const { cookie } = global.signin();

    await request(app)
        .patch(`/api/orders/invalidid`)
        .set("Cookie", cookie)
        .send()
        .expect(400);
});

it("should return 400 if there is no order with the provided ID", async () => {
    const { cookie } = global.signin();

    const orderId = new mongoose.Types.ObjectId();

    await request(app)
        .patch(`/api/orders/${orderId}`)
        .set("Cookie", cookie)
        .send()
        .expect(400);
});

it("should return 403 if the user doesn't own the order", async () => {
    const { cookie } = global.signin();

    const ticket = await Ticket.build({
        title: "a ticket",
        price: 10
    });

    const createOrderResponse = await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin().cookie)
        .send({
            ticketId: ticket.id
        })
        .expect(201);

    await request(app)
        .patch(`/api/orders/${createOrderResponse.body.id}`)
        .set("Cookie", cookie)
        .send()
        .expect(403);
});

it("should cancel the order", async () => {
    const { cookie } = global.signin();

    const ticket = await Ticket.build({
        title: "a ticket",
        price: 10
    });

    const createOrderResponse = await request(app)
        .post("/api/orders")
        .set("Cookie", cookie)
        .send({
            ticketId: ticket.id
        })
        .expect(201);

    const cancelOrderResponse = await request(app)
        .patch(`/api/orders/${createOrderResponse.body.id}`)
        .set("Cookie", cookie)
        .send()
        .expect(200);

    expect(cancelOrderResponse.body.status).toEqual(OrderStatus.Cancelled);


    const response = await request(app)
        .get(`/api/orders/${createOrderResponse.body.id}`)
        .set("Cookie", cookie)
        .send()
        .expect(200);

    expect(response.body.status).toEqual(OrderStatus.Cancelled);
});

it.todo("need to emits an order cancelled event");