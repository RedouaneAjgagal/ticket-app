import { validateRequest } from "@redagtickets/common";
import { body } from "express-validator"

const newPaymentValidator = () => {
    return validateRequest([
        body("paymentIntentId")
            .trim()
            .notEmpty()
            .withMessage("Invalid token"),
        body("orderId")
            .isMongoId()
            .withMessage("Invalid order ID")
    ]);
};

export default newPaymentValidator;