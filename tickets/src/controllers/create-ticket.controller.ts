import { RequestHandler } from "express";
import { Ticket } from "../models";
import { publisher } from "../events";
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
        userId: req.user!.id,
        orders: []
    });

    new publisher.TicketCreatedPublisher(natsWrapper.stan).publish({
        __v: ticket.__v,
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    });

    res.status(201).json(ticket);
};

export default createTicketController