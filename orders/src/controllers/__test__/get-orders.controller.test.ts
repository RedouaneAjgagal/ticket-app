import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models";

const createTicketHandler = async () => {
    const ticket = await Ticket.build({
        __v: 0,
        title: `a ticket title`,
        price: 10
    });

    return ticket;
}

it("should return a 401 if the user is not signed in", async () => {
    await request(app)
        .get("/api/orders")
        .send({})
        .expect(401);
});

it("should return orders in a list format", async () => {
    const { cookie } = global.signin();
    const reponse = await request(app)
        .get("/api/orders")
        .set("Cookie", cookie)
        .send({})
        .expect(200);

    expect(Array.isArray(reponse.body.orders)).toBe(true);
});


it("should only return orders that has been made by the current user", async () => {
    const usersToCreateOrders: { numOfOrders: number; ids: { tickets: string[]; orders: string[] } }[] = [
        {
            numOfOrders: 1,
            ids: {
                tickets: [],
                orders: []
            }
        },
        {
            numOfOrders: 2,
            ids: {
                tickets: [],
                orders: []
            }
        }
    ];

    for (let i = 0; i < usersToCreateOrders.length; i++) {
        const { cookie } = global.signin();

        const user = usersToCreateOrders[i];
        for (let j = 0; j < user.numOfOrders; j++) {
            const ticket = await createTicketHandler();

            const createOrderResponse = await request(app)
                .post("/api/orders")
                .set("Cookie", cookie)
                .send({ ticketId: ticket.id })
                .expect(201);

            user.ids.orders.push(createOrderResponse.body.id);
            user.ids.tickets.push(createOrderResponse.body.ticket.id);
        }

        const response = await request(app)
            .get("/api/orders")
            .set("Cookie", cookie)
            .send({})
            .expect(200);


        expect(response.body.orders.length).toEqual(user.numOfOrders);

        for (let j = 0; j < user.numOfOrders; j++) {
            expect(response.body.orders[j].id).toEqual(user.ids.orders[j]);
            if (response.body.orders[j].ticket.id) {
                expect(response.body.orders[j].ticket.id).toEqual(user.ids.tickets[j]);
            } else {
                expect(response.body.orders[j].ticket).toEqual(user.ids.tickets[j]);
            }
        }
    }
});

it("should populate the ticket data from the order", async () => {
    const { cookie } = global.signin();

    const ticket = await createTicketHandler();

    await request(app)
        .post("/api/orders")
        .set("Cookie", cookie)
        .send({ ticketId: ticket.id })
        .expect(201);

    const response = await request(app)
        .get("/api/orders")
        .set("Cookie", cookie)
        .send({})
        .expect(200);

    expect(response.body.orders.length).toEqual(1);
    expect(typeof response.body.orders[0].ticket === "string").toBe(false);
    expect(response.body.orders[0].ticket.id).toBeDefined();
    expect(response.body.orders[0].ticket.title).toBeDefined();
    expect(response.body.orders[0].ticket.price).toBeDefined();
});