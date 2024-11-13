import { RequestHandler } from "express";
import { Ticket } from "../models";
import mongoose from "mongoose";
import { BadRequestError, UnauthenticatedError } from "@redagtickets/common";
import TicketUpdatedPublisher from "../events/publishers/ticket-updated-publisher";
import natsWrapper from "../nats-wrapper";
import { publisher } from "../events";


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

    if (ticket.orders.length) {
        throw new BadRequestError("Cannot edit a reserved ticket");
    };

    ticket.set({ title, price });
    const isModified = ticket.isModified();
    await ticket.save();

    if (isModified) {
        new publisher.TicketUpdatedPublisher(natsWrapper.stan).publish({
            __v: ticket.__v,
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orders: ticket.orders
        });
    }


    res.status(200).json(ticket);
}

export default updateTicketController;