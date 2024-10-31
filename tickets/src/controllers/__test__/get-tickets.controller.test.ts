import request from "supertest";
import app from "../../app";

const createTicket = () => {
    const { cookie } = global.signin();

    const body = {
        title: "a ticket title",
        price: 10
    };

    return request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send(body)
        .expect(201);
}

it("should not return a 404 when requesting for tickets", async () => {
    const reponse = await request(app)
        .get("/api/tickets")
        .send({});

    expect(reponse.status).not.toEqual(404);
});

it("should return tickets information", async () => {
    const NUM_OF_TICKETS = 3;

    for (let i = 0; i < NUM_OF_TICKETS; i++) {
        await createTicket();
    };

    const response = await request(app)
        .get("/api/tickets")
        .send({})
        .expect(200);

    expect(response.body.tickets.length).toEqual(NUM_OF_TICKETS);
});