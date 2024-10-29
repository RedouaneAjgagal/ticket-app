import request from "supertest";
import app from "../../app";

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
        .send({})
        .set("Cookie", cookie);

    expect(response.status).not.toEqual(401);
});