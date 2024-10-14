import { body } from "express-validator";

const signupUserValidation = () => {
    return [
        body("email")
            .trim()
            .isEmail()
            .withMessage("Invalid email"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Provide a password")
    ]
};

export default signupUserValidation;