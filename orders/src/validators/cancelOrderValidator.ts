import { validateRequest } from "@redagtickets/common"
import { param } from "express-validator"

const cancelOrderValidator = () => {
    return validateRequest([
        param("orderId")
            .isMongoId()
            .withMessage("Invalid order ID")
    ]);
};

export default cancelOrderValidator;