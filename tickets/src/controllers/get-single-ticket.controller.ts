import { RequestHandler } from "express";
import { Ticket } from "../models";
import mongoose from "mongoose";
import { NotFoundError } from "@redagtickets/common";

const getSingleTicketController: RequestHandler = async (req, res) => {
    const { ticketId } = req.params;
    const isValidMongodbId = mongoose.isValidObjectId(ticketId);
    if (!isValidMongodbId) {
        throw new NotFoundError();
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new NotFoundError();
    }

    res.status(200).json(ticket);
};

export default getSingleTicketController;