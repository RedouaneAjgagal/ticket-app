import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models";
import natsWrapper from "../../nats-wrapper";
import { Subjects } from "@redagtickets/common";

it("should not return a 404 when trying to create a ticket as a post request", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .send({});

    expect(response.status).not.toEqual(404);
});

it("should retun a 401 if the user is not signed in", async () => {
    await request(app)
        .post("/api/tickets")
        .send({})
        .expect(401);
});

it("should not return a 401 if the user is signed in", async () => {
    const { cookie } = global.signin();

    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({});

    expect(response.status).not.toEqual(401);
});

it("should throw an error if the ticket title is not provided", async () => {
    const { cookie } = global.signin();

    await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "",
            price: 10
        })
        .expect(400);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            price: 10
        })
        .expect(400);
});

it("should throw an error if the ticket price is invalid or not provided", async () => {
    const { cookie } = global.signin();

    await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "a ticket title",
            price: -1
        })
        .expect(400);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "a ticket title"
        })
        .expect(400);
});

it("should create a ticket with valid inputs and insert it in the database", async () => {
    const { cookie } = global.signin();

    let tickets = await Ticket.find({});
    const INITIAL_START = 0;
    expect(tickets.length).toEqual(INITIAL_START);

    const body = {
        title: "a ticket title",
        price: 10
    };

    await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send(body)
        .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(INITIAL_START + 1);
    expect(tickets[INITIAL_START].title).toEqual(body.title);
    expect(tickets[INITIAL_START].price).toEqual(body.price);
    expect(tickets[INITIAL_START].userId).toBeTruthy();
});

it("should publish a created ticket event", async () => {
    const { cookie } = global.signin();

    const body = {
        title: "a ticket title",
        price: 10
    };

    await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send(body)
        .expect(201);

    expect(natsWrapper.stan.publish).toHaveBeenCalled();
    expect(natsWrapper.stan.publish).toHaveBeenCalledWith(Subjects.TicketCreated, expect.anything(), expect.anything());
});