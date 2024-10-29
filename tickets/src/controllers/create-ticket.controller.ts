import { RequestHandler } from "express";

/**
 * create a new ticket controller
 * @param req 
 * @param res 
 */
const createTicketController: RequestHandler = (req, res) => {
    console.log(req.signedCookies);
    
    res.sendStatus(201);
};

export default createTicketController