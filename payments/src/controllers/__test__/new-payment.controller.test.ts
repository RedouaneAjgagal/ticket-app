import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { Order, Payment } from "../../models";
import { OrderStatus, Subjects } from "@redagtickets/common";
import stripe from "../../stripe";
import natsWrapper from "../../nats-wrapper";

const paymentBody = {
    token: "tok_visa",
    orderId: new mongoose.Types.ObjectId().toHexString()
}

it('should return a 401 if the user is not authenticated', async () => {
    await request(app)
        .post("/api/payments")
        .send(paymentBody)
        .expect(401);
});

it('should provide valid inputs', async () => {
    const { cookie } = global.signin();

    await request(app)
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({})
        .expect(400);

    await request(app)
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({
            token: "tok_visa"
        })
        .expect(400);

    await request(app)
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({
            token: "tok_visa",
            orderId: "invalidId"
        })
        .expect(400);
});

it('should order exist', async () => {
    const { cookie } = global.signin();

    await request(app)
        .post("/api/payments")
        .set("Cookie", cookie)
        .send(paymentBody)
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
        .post("/api/payments")
        .set("Cookie", global.signin().cookie)
        .send({
            token: paymentBody.token,
            orderId: order.id
        })
        .expect(403);
});

it('should only charge orders with created status', async () => {
    const { userId, cookie } = global.signin();

    const order = await Order.build({
        __v: 0,
        createdAt: new Date(),
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Cancelled,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 10
        },
        userId
    });

    await request(app)
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({
            token: paymentBody.token,
            orderId: order.id
        })
        .expect(400);
});

it('should create a charge', async () => {
    const { userId, cookie } = global.signin();

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
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({
            token: paymentBody.token,
            orderId: order.id
        })
        .expect(201);

    expect(stripe.charges.create).toHaveBeenCalled();
    expect(stripe.charges.create).toHaveBeenCalledWith({
        amount: order.ticket.price * 100,
        currency: "usd",
        source: paymentBody.token,
        description: "purchasing a ticket"
    });
});

it('should create a new payment in the db', async () => {
    const { userId, cookie } = global.signin();

    const INITIAL_START_PAYMENTS = 0;

    let payments = await Payment.find({});
    expect(payments.length).toEqual(INITIAL_START_PAYMENTS);

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

    const response = await request(app)
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({
            token: paymentBody.token,
            orderId: order.id
        })
        .expect(201);

    payments = await Payment.find({});
    expect(payments.length).toEqual(INITIAL_START_PAYMENTS + 1);

    const payment = payments[0];
    expect(payment.id).toEqual(response.body.id);
    expect(payment.order.toJSON()).toEqual(order.id);
    expect(payment.chargeId).toBeDefined();
});

it('should publish a new payment created event', async () => {
    const { userId, cookie } = global.signin();

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
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({
            token: paymentBody.token,
            orderId: order.id
        })
        .expect(201);

    expect(natsWrapper.stan.publish).toHaveBeenCalled();
    expect(natsWrapper.stan.publish).toHaveBeenCalledWith(
        Subjects.PaymentCreated,
        expect.anything(),
        expect.anything()
    );
});