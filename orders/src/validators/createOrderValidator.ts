import { validateRequest } from "@redagtickets/common"
import { body } from "express-validator";

const createTicketValidator = () => {
    return validateRequest([
        body("ticketId")
            .isMongoId()
            .withMessage("Invalid ticket ID")
    ]);
}

export default createTicketValidator;