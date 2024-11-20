import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import crypto from "crypto";
import { Jwt } from "@redagtickets/common";

declare global {
    var signin: () => {
        cookie: string[];
        email: string;
        userId: string;
    };
}

jest.mock("../nats-wrapper");
jest.mock("../stripe");

let mongo: MongoMemoryServer;
beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    jest.clearAllMocks();

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


const generateSignedCookie = (token: string) => {
    const base64 = encodeURIComponent(token);

    const signature = crypto
        .createHmac("sha256", process.env.COOKIE_SECRET!)
        .update(base64)
        .digest("base64")
        .replace(/\=+$/, '');

    const signedCookie = `s%3A${base64}.${encodeURIComponent(signature)}`;
    return signedCookie;
}


global.signin = () => {
    const userInformation = {
        email: "test@test.com",
        password: "password"
    }

    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: userInformation.email
    }

    const expiresInMs = 15 * 60 * 1000;
    const token = Jwt.create({
        payload,
        expiresInMs,
        jwtSecret: process.env.JWT_SECRET!
    });

    const signedCookie = generateSignedCookie(token);

    return {
        cookie: [`access_token=${signedCookie}`],
        email: userInformation.email,
        userId: payload.id
    };
}