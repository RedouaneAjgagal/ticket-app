import request from "supertest";
import app from "../../app";
import { AUTHENTICATION_TOKEN_NAME } from "../../helpers";

const API_ENDPOINT = "/api/users/signout";

const userInformation = {
    email: "test@test.com",
    password: "password"
}

const createUser = async () => {
    const response = await request(app)
        .post("/api/users/signup")
        .send(userInformation)
        .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
}

it("should clear the cookie after signout", async () => {
    await createUser();

    const response = await request(app)
        .post(API_ENDPOINT)
        .send({})
        .expect(200);

    const isEmptyToken = response.get("Set-Cookie")?.some(cookie => cookie.includes(AUTHENTICATION_TOKEN_NAME) && cookie.includes("null"));
    expect(isEmptyToken).toBe(true);
});