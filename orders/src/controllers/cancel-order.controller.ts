import { RequestHandler } from "express";
import { Order } from "../models";
import { BadRequestError, OrderStatus, Unauthorized } from "@redagtickets/common";
import { publisher } from "../events";
import natsWrapper from "../nats-wrapper";

/**
 * cancel user's order controller
 * @param req 
 * @param res 
 */
const cancelOrderController: RequestHandler = async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("ticket");
    if (!order) {
        throw new BadRequestError("Invalid order ID");
    };

    const isOrderBelongToUser = order.userId === req.user!.id;
    if (!isOrderBelongToUser) {
        throw new Unauthorized();
    };

    order.status = OrderStatus.Cancelled;
    await order.save();

    new publisher.OrderCancelledPublisher(natsWrapper.stan).publish({
        __v: order.__v,
        id: order.id,
        status: order.status,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: order.ticket.id,
            title: order.ticket.title,
            price: order.ticket.price
        }
    });

    res.status(200).json(order);
};

export default cancelOrderController;