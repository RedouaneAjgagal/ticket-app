import { param } from "express-validator"
import { validateRequest } from "@redagtickets/common"

const getSIngleOrderValidator = () => {
    return validateRequest([
        param("orderId")
            .isMongoId()
            .withMessage("Invalid Order ID")
    ]);
};

export default getSIngleOrderValidator;