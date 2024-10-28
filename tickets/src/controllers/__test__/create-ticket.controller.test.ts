import request from "supertest";
import app from "../../app";

it("should not return a 404 when trying to create a ticket as a post request", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .send({});

    expect(response.status).not.toEqual(404);
});