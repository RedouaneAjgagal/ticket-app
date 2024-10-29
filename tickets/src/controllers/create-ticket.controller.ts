import { validationResult } from "express-validator";
import { RequestHandler } from "express";
import { RequestValidationError } from "@redagtickets/common";

/**
 * create a new ticket controller
 * @param req 
 * @param res 
 */
const createTicketController: RequestHandler = (req, res) => {
    res.sendStatus(201);
};

export default createTicketController