import { RequestHandler } from "express";
import { Order } from "../models";
import { BadRequestError, UnauthorizedError } from "@redagtickets/common";
import stripe from "../stripe";

/**
 * Create stripe payment intent to provide the client with a (client secret)
 * @param req 
 * @param res 
 */
const createPaymentIntentController: RequestHandler = async (req, res) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
        throw new BadRequestError("Invalid order");
    };

    const isAuthorized = order.userId === req.user!.id;
    if (!isAuthorized) {
        throw new UnauthorizedError();
    };

    const paymentIntent = await stripe.paymentIntents.create({
        amount: order.ticket.price * 100,
        currency: "usd",
        description: "purchasing a ticket",
        payment_method_types: ["card"]
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
};

export default createPaymentIntentController;