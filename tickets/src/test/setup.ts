import mongoose from "mongoose";
import app from "../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";

declare global {
    var signin: () => Promise<{
        cookie: string[];
        email: string;
    }>;
}

let mongo: MongoMemoryServer;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();

        for (let collection of collections) {
            await collection.deleteMany({});
        }
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

global.signin = async () => {
    const userInformation = {
        email: "test@test.com",
        password: "password"
    }

    const response = await request(app)
        .post("/api/users/signup")
        .send(userInformation)
        .expect(201);

    const cookie = response.get("Set-Cookie");
    if (!cookie) {
        throw new Error("Faild to get cookie from response");
    }

    return {
        cookie,
        email: userInformation.email
    };
}