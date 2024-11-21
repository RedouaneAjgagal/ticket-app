import { RequestHandler } from "express";
import { Order, Payment } from "../models";
import { BadRequestError, OrderStatus, UnauthorizedError } from "@redagtickets/common";
import stripe from "../stripe";


/**
 * charge order controller
 * @param req
 * @param res
 */
const newPaymentController: RequestHandler = async (req, res) => {
    const { token, orderId } = req.body;

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
    }

    const charge = await stripe.charges.create({
        amount: order.ticket.price * 100,
        currency: "usd",
        source: token,
        description: "purchasing a ticket"
    });

    const payment = await Payment.build({
        order: order.id,
        chargeId: charge.id
    });

    res.status(201).json({ id: payment.id });
}

export default newPaymentController;