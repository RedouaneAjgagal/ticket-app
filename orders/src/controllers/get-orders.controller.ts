import { RequestHandler } from "express";

/**
 * Get all user's orders details controller
 * @param req 
 * @param res 
 */
const getOrdersController: RequestHandler = async (req, res) => {
    res.sendStatus(200);
};

export default getOrdersController;