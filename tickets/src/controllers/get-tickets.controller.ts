import { RequestHandler } from "express";
import { Ticket } from "../models";

/**
 * get tickets information controller
 * @param req 
 * @param res 
 */
const getTicketsController: RequestHandler = async (req, res) => {
    const tickets = await Ticket.find({});
    res.status(200).json({ tickets });
};

export default getTicketsController;