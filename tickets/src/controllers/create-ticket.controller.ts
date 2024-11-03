import { RequestHandler } from "express";
import { Ticket } from "../models";
import { publishers } from "../events";
import natsWrapper from "../nats-wrapper";

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

    new publishers.TicketCreatedPublisher(natsWrapper.stan).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    });

    res.status(201).json(ticket);
};

export default createTicketController