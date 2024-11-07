import { RequestHandler } from "express";
import { Order } from "../models";
import { BadRequestError, OrderStatus, Unauthorized } from "@redagtickets/common";

/**
 * cancel user's order controller
 * @param req 
 * @param res 
 */
const cancelOrderController: RequestHandler = async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
        throw new BadRequestError("Invalid order ID");
    };

    const isOrderBelongToUser = order.userId === req.user!.id;
    if (!isOrderBelongToUser) {
        throw new Unauthorized();
    };

    order.status = OrderStatus.Cancelled;
    order.save();

    res.status(200).json(order);
};

export default cancelOrderController;