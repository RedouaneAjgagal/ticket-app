import { RequestValidationError } from "@redagtickets/common";
import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const createTicketValidator = () => {
    return [
        [
            body("title")
                .not().isEmpty()
                .withMessage("Title shouldn't be empty"),
            body("price")
                .isFloat({ gt: 0 })
                .withMessage("Price should be greater than 0")
        ],
        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new RequestValidationError(errors.array());
            }
            next();
        }
    ];
};

export default createTicketValidator;