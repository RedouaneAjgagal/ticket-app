import { RequestHandler } from "express";

/**
 * create an order controller
 * @param req 
 * @param res 
 */
const createOrderController: RequestHandler = async (req, res) => {
    res.sendStatus(201);
};

export default createOrderController;