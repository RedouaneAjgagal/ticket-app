import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models";
import { OrderStatus } from "@redagtickets/common";
import stripe from "../../stripe";

it('should return a 401 if the user is not authenticated', async () => {
    await request(app)
        .post("/api/payments/create-payment-intent")
        .send({ orderId: new mongoose.Types.ObjectId() })
        .expect(401);
});

it('should return 400 if order ID is not valid or provided', async () => {
    const { cookie } = global.signin();
    await request(app)
        .post("/api/payments/create-payment-intent")
        .set("Cookie", cookie)
        .send()
        .expect(400);

    await request(app)
        .post("/api/payments/create-payment-intent")
        .set("Cookie", cookie)
        .send({ orderId: "invalidId" })
        .expect(400);
});

it('should order exist', async () => {
    const { cookie } = global.signin();

    await request(app)
        .post("/api/payments/create-payment-intent")
        .set("Cookie", cookie)
        .send({ orderId: new mongoose.Types.ObjectId() })
        .expect(400);
});

it('should the order belong to the user', async () => {
    const { userId } = global.signin();

    const order = await Order.build({
        __v: 0,
        createdAt: new Date(),
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 10
        },
        userId
    });

    await request(app)
        .post("/api/payments/create-payment-intent")
        .set("Cookie", global.signin().cookie)
        .send({
            orderId: order.id
        })
        .expect(403);
});

it('should create the payment intent with valid order information', async () => {
    const { cookie, userId } = global.signin();

    const order = await Order.build({
        __v: 0,
        createdAt: new Date(),
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 10
        },
        userId
    });

    await request(app)
        .post("/api/payments/create-payment-intent")
        .set("Cookie", cookie)
        .send({
            orderId: order.id
        })
        .expect(200);

    expect(stripe.paymentIntents.create).toHaveBeenCalled();
    expect(stripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: order.ticket.price * 100,
        currency: "usd",
        description: "purchasing a ticket",
        payment_method_types: ["card"],
        capture_method: "manual"
    });
});

it('should return the client secret after creating the payment intent', async () => {
    const { cookie, userId } = global.signin();

    const order = await Order.build({
        __v: 0,
        createdAt: new Date(),
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 10
        },
        userId
    });

    const mockedClientSecret = "pi_123456_secret_123456";
    (stripe.paymentIntents.create as jest.Mock).mockResolvedValueOnce({ client_secret: mockedClientSecret });

    const response = await request(app)
        .post("/api/payments/create-payment-intent")
        .set("Cookie", cookie)
        .send({
            orderId: order.id
        })
        .expect(200);

    expect(stripe.paymentIntents.create).toHaveBeenCalled();
    expect(response.body.clientSecret).toBeDefined();
    expect(response.body.clientSecret).toEqual(mockedClientSecret);
});