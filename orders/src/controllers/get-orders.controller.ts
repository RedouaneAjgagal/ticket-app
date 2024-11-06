import { RequestHandler } from "express";
import { Order } from "../models";

/**
 * Get all user's orders details controller
 * @param req 
 * @param res 
 */
const getOrdersController: RequestHandler = async (req, res) => {
    const orders = await Order.find({
        userId: req.user!.id
    }).populate("ticket");

    res.status(200).json({ orders });
};

export default getOrdersController;