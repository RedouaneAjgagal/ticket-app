import { body } from "express-validator";
import { validateRequest } from "@redagtickets/common";

const signupUserValidation = () => {
    return validateRequest([
        body("email")
            .trim()
            .isEmail()
            .withMessage("Invalid email"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Provide a password")
    ]);
};

export default signupUserValidation;