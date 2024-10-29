import { body } from "express-validator";
import { validateRequest } from "@redagtickets/common";

const createUserValidation = () => {
    return validateRequest([
        // Email validation
        body("email")
            .trim()
            .isEmail()
            .withMessage("Invalid email"),

        // Password validation
        body("password")
            .trim()
            .isLength({ min: 6, max: 24 })
            .withMessage("Password must be between 6 and 24 characters")
    ]);
};

export default createUserValidation;