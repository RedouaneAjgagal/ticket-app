import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";

it("should return a 404 if it's invalid ticket ID", async () => {
    await request(app)
        .get(`/api/tickets/invalidTicketId`)
        .expect(404);
});

it("should return a 404 if the ticket is not exist", async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/${ticketId}`)
        .expect(404);
});

it("should return ticket information", async () => {
    const { cookie } = global.signin();

    const body = {
        title: "a ticket title",
        price: 10
    };

    const createTicketResponse = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send(body)
        .expect(201);

    const getTicketResponse = await request(app)
        .get(`/api/tickets/${createTicketResponse.body.id}`)
        .expect(200);

    expect(getTicketResponse.body.title).toEqual(createTicketResponse.body.title);
    expect(getTicketResponse.body.price).toEqual(createTicketResponse.body.price);
    expect(getTicketResponse.body.id).toEqual(createTicketResponse.body.id);
    expect(getTicketResponse.body.userId).toEqual(createTicketResponse.body.userId);
});