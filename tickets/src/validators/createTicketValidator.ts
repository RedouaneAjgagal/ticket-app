import { validateRequest, } from "@redagtickets/common";
import { body } from "express-validator";


const createTicketValidator = () => {
    return validateRequest(
        [
            body("title")
                .not().isEmpty()
                .withMessage("Title shouldn't be empty"),
            body("price")
                .isFloat({ gt: 0 })
                .withMessage("Price should be greater than 0")
        ]
    );
};

export default createTicketValidator;