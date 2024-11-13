import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import natsWrapper from "../../nats-wrapper";
import { Subjects } from "@redagtickets/common";
import { Ticket } from "../../models";

const validInputs = {
    title: "a valid ticket title",
    price: 10
};

const invalidInputs = {
    title: "",
    price: -10
};

it("should find the route for updating the ticket", async () => {
    const { cookie } = global.signin();

    const ticketId = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app)
        .put(`/api/tickets/${ticketId}`)
        .set("Cookie", cookie)
        .send(validInputs);

    expect(response.status).not.toBe(404);
});

it("should return 401 if the user is not signed in", async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${ticketId}`)
        .send(validInputs)
        .expect(401);
});

it("should have a valid ticket id for updating the ticket", async () => {
    const { cookie } = global.signin();

    await request(app)
        .put("/api/tickets/invalidId")
        .set("Cookie", cookie)
        .send(validInputs)
        .expect(400);
});

it("should return a 400 if the provided ticket is not exist", async () => {
    const { cookie } = global.signin();

    const ticketId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${ticketId}`)
        .set("Cookie", cookie)
        .send(validInputs)
        .expect(400);
});

it("should ticket belong to the current user", async () => {
    const { cookie: signedinUserCookie } = global.signin();
    const { cookie: createdTicketUserCookie } = global.signin();

    const createTicketResponse = await request(app)
        .post("/api/tickets")
        .set("Cookie", createdTicketUserCookie)
        .send(validInputs)
        .expect(201);

    const updatedTicketInputs = {
        title: "updated ticket title",
        price: 99
    }

    // update ticket request
    await request(app)
        .put(`/api/tickets/${createTicketResponse.body.id}`)
        .set("Cookie", signedinUserCookie)
        .send(updatedTicketInputs)
        .expect(401);

    const getTicketResponse = await request(app)
        .get(`/api/tickets/${createTicketResponse.body.id}`)
        .send({})
        .expect(200);

    expect(getTicketResponse.body.title).toEqual(validInputs.title);
    expect(getTicketResponse.body.price).toEqual(validInputs.price);
});

it("should retun a 400 if its invalid inputs", async () => {
    const { cookie } = global.signin();

    const createTicketResponse = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send(validInputs)
        .expect(201);

    await request(app)
        .put(`/api/tickets/${createTicketResponse.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: invalidInputs.title,
            price: validInputs.price
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${createTicketResponse.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: validInputs.title,
            price: invalidInputs.price
        })
        .expect(400);
});

it('should return a 400 if the ticket is already reserved', async () => {
    const { cookie } = global.signin();

    const createTicketResponse = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send(validInputs)
        .expect(201);

    const ticket = await Ticket.findById(createTicketResponse.body.id);
    expect(ticket).not.toBe(null);

    ticket!.orders.push(new mongoose.Types.ObjectId().toHexString());
    await ticket?.save();

    await request(app)
        .put(`/api/tickets/${createTicketResponse.body.id}`)
        .set("Cookie", cookie)
        .send(validInputs)
        .expect(400);
});

it("should update the ticket details", async () => {
    const { cookie } = global.signin();

    const createTicketResponse = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send(validInputs)
        .expect(201);

    const updatedTicketInputs = {
        title: "updated ticket title",
        price: 99
    }

    // updated ticket request
    await request(app)
        .put(`/api/tickets/${createTicketResponse.body.id}`)
        .set("Cookie", cookie)
        .send(updatedTicketInputs)
        .expect(200);

    const getTicketResponse = await request(app)
        .get(`/api/tickets/${createTicketResponse.body.id}`)
        .send({})
        .expect(200);

    expect(getTicketResponse.body.title).toEqual(updatedTicketInputs.title);
    expect(getTicketResponse.body.price).toEqual(updatedTicketInputs.price);
});

it("should publish an updated ticket event", async () => {
    const { cookie } = global.signin();

    const createTicketResponse = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send(validInputs)
        .expect(201);

    const updatedTicketInputs = {
        title: "updated ticket title",
        price: 99
    }

    // updated ticket request
    await request(app)
        .put(`/api/tickets/${createTicketResponse.body.id}`)
        .set("Cookie", cookie)
        .send(updatedTicketInputs)
        .expect(200);

    expect(natsWrapper.stan.publish).toHaveBeenCalled();
    expect(natsWrapper.stan.publish).toHaveBeenCalledWith(Subjects.TicketUpdated, expect.anything(), expect.anything());
});