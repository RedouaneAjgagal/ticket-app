import { RequestHandler } from "express";
import { Order, Payment } from "../models";
import { BadRequestError, OrderStatus, UnauthorizedError } from "@redagtickets/common";
import stripe from "../stripe";
import { publisher } from "../events";
import natsWrapper from "../nats-wrapper";


/**
 * charge order controller
 * @param req
 * @param res
 */
const newPaymentController: RequestHandler = async (req, res) => {
    const { paymentIntentId, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
        throw new BadRequestError("Invalid order");
    };

    const isAuthorized = order.userId === req.user!.id;
    if (!isAuthorized) {
        throw new UnauthorizedError();
    };

    const validStatusToCharge = [OrderStatus.Created];

    if (!validStatusToCharge.includes(order.status)) {
        throw new BadRequestError("Unable to charge this order");
    };

    const capturePaymentIntent = await stripe.paymentIntents.capture(paymentIntentId);

    if (capturePaymentIntent.status !== "succeeded") {
        throw new BadRequestError("Unpaid ticket");
    };

    const payment = await Payment.build({
        order: order.id,
        chargeId: capturePaymentIntent.id
    });

    new publisher.PaymentCreatedPublisher(natsWrapper.stan).publish({
        __v: payment.__v,
        id: payment.id,
        chargeId: payment.chargeId,
        orderId: payment.order._id.toHexString()
    });

    res.status(201).json({ id: payment.id });
};

export default newPaymentController;