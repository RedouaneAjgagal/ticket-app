import { validateRequest } from "@redagtickets/common";
import { body } from "express-validator";

const createPaymentIntentValidator = () => {
    return validateRequest([
        body("orderId")
            .isMongoId()
            .withMessage("Invalid order ID")
    ]);
};

export default createPaymentIntentValidator;