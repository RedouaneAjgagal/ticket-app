import { RequestHandler } from "express";

/**
 * delete user's order controller
 * @param req 
 * @param res 
 */
const deleteOrderController: RequestHandler = async (req, res) => {
    res.sendStatus(200);
};

export default deleteOrderController;