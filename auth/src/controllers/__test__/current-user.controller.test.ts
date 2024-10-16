import request from "supertest";
import app from "../../app";

const API_ENDPOINT = "/api/users/current-user";

it("should returns user information", async () => {
    const { cookie, email } = await global.signin();

    const response = await request(app)
        .get(API_ENDPOINT)
        .set("Cookie", cookie)
        .send({})
        .expect(200);

    expect(response.body.user).not.toBe(null);
    expect(response.body.user.id).toBeTruthy();
    expect(response.body.user.email).toEqual(email);
});

it("should return null when the user is not logged in", async () => {
    const response = await request(app)
        .get(API_ENDPOINT)
        .send({})
        .expect(200);

    expect(response.body.user).toBeNull();
});