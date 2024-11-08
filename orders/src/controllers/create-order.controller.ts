import { RequestHandler } from "express";
import { Order, Ticket } from "../models";
import { BadRequestError, OrderStatus } from "@redagtickets/common";
import { publisher } from "../events";
import natsWrapper from "../nats-wrapper";

/**
 * create an order controller
 * @param req 
 * @param res 
 */
const createOrderController: RequestHandler = async (req, res) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new BadRequestError("Invalid ticket ID");
    };

    const isReserved = await ticket.isReserved();
    if (isReserved) {
        throw new BadRequestError("Ticket is already reserved");
    }

    const order = await Order.build({
        userId: req.user!.id,
        ticket,
        status: OrderStatus.Created
    });

    new publisher.OrderCreatedPublisher(natsWrapper.stan).publish({
        id: order.id,
        status: order.status,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: ticket.id,
            title: ticket.title,
            price: ticket.price
        }
    });

    res.status(201).json(order);
};

export default createOrderController;