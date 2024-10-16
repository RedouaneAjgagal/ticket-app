import request from "supertest";
import app from "../../app";

const API_ENDPOINT = "/api/users/signin";

const userInformation = {
    email: "test@test.com",
    password: "password"
}

const createUser = async () => {
    await request(app)
        .post("/api/users/signup")
        .send(userInformation)
        .expect(201);
}

it("should fail with invalid user credentials", async () => {
    return request(app)
        .post(API_ENDPOINT)
        .send({
            email: "no-user@test.com",
            password: "password"
        })
        .expect(400)
});

it("should fail if it's invalid password", async () => {
    await createUser();

    return request(app)
        .post(API_ENDPOINT)
        .send({
            ...userInformation,
            password: "invalid-password"
        })
        .expect(400);
});

it("should return 200 with attached cookie when passsing a valid credentials", async () => {
    await createUser();

    const response = await request(app)
        .post(API_ENDPOINT)
        .send(userInformation)
        .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
});