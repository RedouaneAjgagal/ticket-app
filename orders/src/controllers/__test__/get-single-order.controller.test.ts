import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models";

it("should return 401 if ther user is not signed in", async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/orders/${orderId}`)
        .send({})
        .expect(401);
});

it("should return 400 if the user provide an invalid order ID", async () => {
    const { cookie } = global.signin();

    await request(app)
        .get("/api/orders/invalidId")
        .set("Cookie", cookie)
        .send({})
        .expect(400);
});

it("should return 400 if there is no order with the provided ID", async () => {
    const { cookie } = global.signin();

    const orderId = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .get(`/api/orders/${orderId}`)
        .set("Cookie", cookie)
        .send({})
        .expect(400);
});

it("should return 403 if the order is not belong to the current user", async () => {
    const { cookie } = global.signin();

    const ticket = await Ticket.build({
        __v: 0,
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
        .get(`/api/orders/${createOrderResponse.body.id}`)
        .set("Cookie", cookie)
        .send({})
        .expect(403);
});

it("should return the order details", async () => {
    const { cookie } = global.signin();

    const ticket = await Ticket.build({
        __v: 0,
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

    const response = await request(app)
        .get(`/api/orders/${createOrderResponse.body.id}`)
        .set("Cookie", cookie)
        .send({})
        .expect(200);

    expect(typeof response.body === "object").toBe(true);
    expect(response.body.id).toEqual(createOrderResponse.body.id);
});

it("should populate the ticket data from the order", async () => {
    const { cookie } = global.signin();

    const ticket = await Ticket.build({
        __v: 0,
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

    const response = await request(app)
        .get(`/api/orders/${createOrderResponse.body.id}`)
        .set("Cookie", cookie)
        .send({})
        .expect(200);

    expect(typeof response.body.ticket !== "string").toBe(true);
    expect(response.body.ticket.id).toBeDefined();
    expect(response.body.ticket.title).toBeDefined();
    expect(response.body.ticket.price).toBeDefined();
});