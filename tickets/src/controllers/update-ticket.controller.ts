import { RequestHandler } from "express";
import { Ticket } from "../models";
import mongoose from "mongoose";
import { BadRequestError, UnauthenticatedError } from "@redagtickets/common";
import TicketUpdatedPublisher from "../events/publishers/ticket-updated-publisher";
import natsWrapper from "../nats-wrapper";


/**
 * update ticket controller
 * @param req 
 * @param res 
 */
const updateTicketController: RequestHandler = async (req, res) => {
    const { ticketId } = req.params;
    const { title, price } = req.body;

    const isValidMongodbId = mongoose.isValidObjectId(ticketId);
    if (!isValidMongodbId) {
        throw new BadRequestError("Invalid ticket ID");
    };

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new BadRequestError(`You don't have ticket with ID ${ticketId}`);
    };

    if (ticket.userId !== req.user!.id) {
        throw new UnauthenticatedError();
    };

    ticket.set({ title, price });
    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.stan).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    });

    res.status(200).json(ticket);
}

export default updateTicketController;