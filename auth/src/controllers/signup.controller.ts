//@ts-check
import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors";

/**
 * signup a user controller
 * @param req
 * @param res
 */
const signupController: RequestHandler = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    res.status(200).json({ status: "signup" });
}

export default signupController;