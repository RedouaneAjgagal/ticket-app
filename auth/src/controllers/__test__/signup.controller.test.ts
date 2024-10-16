import request from "supertest";
import app from "../../app";

const API_ENDPOINT = "/api/users/signup";

it("should return a 201 on successful signup", async () => {
    const response = await request(app)
        .post(API_ENDPOINT)
        .send({
            email: "test@test.com",
            password: "password"
        });
    expect(response.status).toEqual(201);
});

it("should return a 400 with an invalid email", async () => {
    return request(app)
        .post(API_ENDPOINT)
        .send({
            email: "invalid-email",
            password: "password"
        })
        .expect(400);
});

it("should return a 400 with an invalid password", async () => {
    return request(app)
        .post(API_ENDPOINT)
        .send({
            email: "test@test.com",
            password: "123"
        })
        .expect(400);
});

it("should return a 400 with missing email or password", async () => {
    await request(app)
        .post(API_ENDPOINT)
        .send({
            email: "test@test.com"
        })
        .expect(400);

    await request(app)
        .post(API_ENDPOINT)
        .send({
            password: "password"
        })
        .expect(400);
});

it("should disallows duplicate email", async () => {
    await request(app)
        .post(API_ENDPOINT)
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);

    await request(app)
        .post(API_ENDPOINT)
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(400);
});

it("should set a cookie after successful signup", async () => {
    const response = await request(app)
        .post(API_ENDPOINT)
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
});