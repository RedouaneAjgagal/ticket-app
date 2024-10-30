import { RequestHandler } from "express";
import { Ticket } from "../models";

/**
 * create a new ticket controller
 * @param req 
 * @param res 
 */
const createTicketController: RequestHandler = async (req, res) => {
    const { title, price } = req.body;
    const ticket = await Ticket.build({
        title,
        price,
        userId: req.user!.id
    });

    res.status(201).json(ticket);
};

export default createTicketController