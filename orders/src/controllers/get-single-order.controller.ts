import { RequestHandler } from "express";

/**
 * get user's order details controller
 * @param req 
 * @param res 
 */
const getSingleOrderController: RequestHandler = async (req, res) => {
    res.sendStatus(200);
};

export default getSingleOrderController;