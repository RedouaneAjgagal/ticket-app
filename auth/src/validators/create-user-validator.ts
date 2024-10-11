import { body } from "express-validator";

const createUserValidation = () => {
    return [
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
    ];
};

export default createUserValidation;