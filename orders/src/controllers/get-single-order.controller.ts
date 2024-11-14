import { RequestHandler } from "express";
import { Order } from "../models";
import { BadRequestError, UnauthorizedError } from "@redagtickets/common";

/**
 * get user's order details controller
 * @param req 
 * @param res 
 */
const getSingleOrderController: RequestHandler = async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("ticket");
    if (!order) {
        throw new BadRequestError("Invalid order ID");
    };

    const isBelongToCurrentUser = order.userId === req.user!.id;
    if (!isBelongToCurrentUser) {
        throw new UnauthorizedError();
    }

    res.status(200).json(order);
};

export default getSingleOrderController;